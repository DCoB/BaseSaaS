const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parser manual robusto para garantir leitura do .env mesmo em ambientes restritos
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      if (line.trim().startsWith('#') || !line.includes('=')) return;
      const [key, ...valueParts] = line.split('=');
      const val = valueParts.join('=').trim();
      let cleanVal = val;
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        cleanVal = val.slice(1, -1);
      }
      process.env[key.trim()] = cleanVal;
    });
  } catch (e) {}
}

// Tentar carregar dotenv como plano B
try {
  require('dotenv').config({ path: envPath });
} catch (e) {}

if (!process.env.GITHUB_TOKEN) {
  try {
    const envTsPath = path.join(process.cwd(), 'src/environments/environment.ts');
    if (fs.existsSync(envTsPath)) {
      const tsContent = fs.readFileSync(envTsPath, 'utf8');
      const match = tsContent.match(/GITHUB_TOKEN\s*:\s*['"`](.*?)['"`]/);
      if (match && match[1]) {
        process.env.GITHUB_TOKEN = match[1];
      }
    }
  } catch (e) {}
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function runGit(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (e) {
    return '';
  }
}

console.log('--- GERANDO ANÁLISE DE PR AUTOMÁTICA E CONCISA ---\n');

// 1. Obter branch atual
const currentBranch = runGit('git branch --show-current');
if (!currentBranch || currentBranch === 'main') {
  console.error('Erro: Você está na branch main ou não foi possível detectar a branch atual.');
  process.exit(1);
}

// 2. Rodar Testes Unitários Obrigatórios
console.log('🔄 Passo 1: Executando os testes unitários da aplicação...');
try {
  execSync('npm run test', { stdio: 'inherit' });
  console.log('\n✅ Passo 1 Concluído: Todos os testes unitários passaram com sucesso!\n');
} catch (e) {
  console.error('\n❌ Erro: Os testes unitários falharam! Resolva os erros dos testes antes de criar o PR.');
  process.exit(1);
}

// 3. Obter arquivos modificados
const diffFilesRaw = runGit('git diff main...HEAD --name-status');
if (!diffFilesRaw) {
  console.log('Nenhuma modificação detectada em relação à branch main.');
  process.exit(0);
}

// 4. Obter commits
const commitsRaw = runGit('git log main..HEAD --oneline');

// Organizar arquivos por status e tipo
const files = diffFilesRaw.split('\n').map(line => {
  const [status, filePath] = line.split(/\s+/);
  return { status, filePath };
});

console.log('🔄 Passo 2: Verificando cobertura e conformidade de testes unitários (.spec.ts)...');
let testAuditPassed = true;
const auditMessages = [];

files.forEach(f => {
  const isCodeFile = f.filePath.endsWith('.ts') && !f.filePath.endsWith('.spec.ts') && f.filePath.startsWith('src/');
  const isHtmlTemplate = f.filePath.endsWith('.html') && f.filePath.startsWith('src/');

  if (isCodeFile || isHtmlTemplate) {
    const ext = path.extname(f.filePath);
    const specPath = f.filePath.replace(ext, '.spec.ts');
    const hasSpecInDiff = files.some(file => file.filePath === specPath);
    const hasSpecInFs = fs.existsSync(path.join(process.cwd(), specPath));

    if (f.status === 'A') { // Adicionado
      if (!hasSpecInDiff && !hasSpecInFs) {
        auditMessages.push(`⚠️  [Novo Componente/Código] O arquivo \`${f.filePath}\` foi adicionado, mas nenhum teste unitário correspondente \`${specPath}\` foi criado.`);
        testAuditPassed = false;
      } else {
        auditMessages.push(`✅ [Novo Componente/Código] Novo teste \`${specPath}\` criado com sucesso.`);
      }
    } else if (f.status === 'M') { // Modificado
      if (!hasSpecInDiff) {
        auditMessages.push(`⚠️  [Lógica Modificada] O arquivo \`${f.filePath}\` foi modificado, mas seu teste unitário correspondente \`${specPath}\` não foi alterado nesta branch. Considere verificar se novas asserções são necessárias.`);
      } else {
        auditMessages.push(`✅ [Lógica Modificada] Teste correspondente \`${specPath}\` também foi modificado e validado.`);
      }
    } else if (f.status === 'D') { // Deletado
      const hasSpecDeleted = files.some(file => file.filePath === specPath && file.status === 'D');
      if (!hasSpecDeleted && hasSpecInFs) {
        auditMessages.push(`⚠️  [Remoção] O arquivo lógico \`${f.filePath}\` foi deletado, mas o arquivo de testes \`${specPath}\` continua no projeto.`);
        testAuditPassed = false;
      } else if (hasSpecDeleted) {
        auditMessages.push(`✅ [Remoção] O arquivo de teste correspondente \`${specPath}\` também foi deletado.`);
      }
    }
  }
});

if (auditMessages.length > 0) {
  auditMessages.forEach(msg => console.log(msg));
} else {
  console.log('✅ Nenhuma modificação lógica de arquivos que demande novos specs.');
}

console.log('\n🔄 Passo 3: Verificando a necessidade de atualizar documentações...');
let docsNeeded = false;
const docsMessages = [];

const infraChanges = files.filter(f => 
  f.filePath.includes('supabase') || 
  f.filePath.endsWith('.env') || 
  f.filePath.endsWith('environment.ts') || 
  f.filePath.endsWith('environment.development.ts') ||
  f.filePath.includes('package.json') ||
  f.filePath.includes('scripts/')
);

const docChanges = files.filter(f => f.filePath.endsWith('.md') && (f.filePath.includes('docs/') || f.filePath.startsWith('README')));

if (infraChanges.length > 0) {
  docsNeeded = true;
  docsMessages.push(`💡 Modificações de infraestrutura, ambientes ou dependências detectadas em:`);
  infraChanges.forEach(c => docsMessages.push(`   - \`${c.filePath}\` (${c.status})`));
  
  if (docChanges.length === 0) {
    docsMessages.push(`⚠️  Alerta: Foram feitas mudanças de infraestrutura, mas NENHUM arquivo de documentação (.md) foi modificado. Considere atualizar o README.md ou guias de tutoriais na pasta \`docs/\`.`);
  } else {
    docsMessages.push(`✅ Documentação atualizada na mesma branch em:`);
    docChanges.forEach(d => docsMessages.push(`   - \`${d.filePath}\` (${d.status})`));
  }
} else {
  console.log('✅ Nenhuma alteração crítica de infraestrutura que demande atualização obrigatória de documentação.');
}

if (docsMessages.length > 0) {
  console.log('');
  docsMessages.forEach(msg => console.log(msg));
}

console.log('\n------------------------------------------------\n');

const categories = {
  Componentes: [],
  Estilos: [],
  Traducoes: [],
  Outros: []
};

files.forEach(f => {
  if (f.filePath.endsWith('.css')) {
    categories.Estilos.push(f.filePath);
  } else if (f.filePath.endsWith('.ts') || f.filePath.endsWith('.html')) {
    categories.Componentes.push(f.filePath);
  } else if (f.filePath.includes('i18n') || f.filePath.endsWith('.json')) {
    categories.Traducoes.push(f.filePath);
  } else {
    categories.Outros.push(f.filePath);
  }
});

let bodyText = `## 🚀 Resumo das Modificações\n\n`;

if (categories.Componentes.length > 0) {
  bodyText += `### 💻 Componentes e Lógica:\n`;
  categories.Componentes.forEach(file => {
    bodyText += `- Atualização de comportamento/template em \`${file}\`\n`;
  });
  bodyText += `\n`;
}

if (categories.Estilos.length > 0) {
  bodyText += `### 🎨 Estilos e Interface:\n`;
  categories.Estilos.forEach(file => {
    bodyText += `- Ajustes de design e layout em \`${file}\`\n`;
  });
  bodyText += `\n`;
}

if (categories.Traducoes.length > 0) {
  bodyText += `### 🌐 Internacionalização (i18n):\n`;
  categories.Traducoes.forEach(file => {
    bodyText += `- Atualização e limpeza de traduções em \`${file}\`\n`;
  });
  bodyText += `\n`;
}

if (categories.Outros.length > 0) {
  bodyText += `### 📁 Outras Alterações:\n`;
  categories.Outros.forEach(file => {
    bodyText += `- Modificações gerais em \`${file}\`\n`;
  });
  bodyText += `\n`;
}

bodyText += `## 🧪 Auditoria de Testes Unitários:\n`;
if (auditMessages.length > 0) {
  auditMessages.forEach(msg => {
    bodyText += `- ${msg}\n`;
  });
} else {
  bodyText += `- ✅ Todos os arquivos em conformidade.\n`;
}
bodyText += `\n`;

bodyText += `## 📚 Auditoria de Documentação:\n`;
if (docsMessages.length > 0) {
  docsMessages.forEach(msg => {
    bodyText += `- ${msg}\n`;
  });
} else {
  bodyText += `- ✅ Nenhuma documentação crítica necessária ou tudo atualizado.\n`;
}
bodyText += `\n`;

if (commitsRaw) {
  bodyText += `## 🕒 Histórico de Commits:\n`;
  commitsRaw.split('\n').forEach(commit => {
    bodyText += `- \`${commit}\`\n`;
  });
}

const prTitle = runGit('git log -1 --pretty=%s') || `feat: atualizações na branch ${currentBranch}`;

console.log('--- SUMÁRIO DO PULL REQUEST ---');
console.log(bodyText);

const isPlaceholderToken = GITHUB_TOKEN && (GITHUB_TOKEN.includes('placeholder') || GITHUB_TOKEN === '');

if (!GITHUB_TOKEN || isPlaceholderToken) {
  console.error('\n❌ Erro: GITHUB_TOKEN não configurado ou é um placeholder no arquivo .env.');
  console.error('Para criação direta via linha de comando, adicione no seu arquivo .env:');
  console.error('GITHUB_TOKEN=seu_personal_access_token_aqui\n');
  
  const baseUrl = 'https://github.com/DCoB/base-saas/compare/main...';
  const queryParams = `?expand=1&title=${encodeURIComponent(prTitle)}&body=${encodeURIComponent(bodyText)}`;
  const fullPrUrl = `${baseUrl}${currentBranch}${queryParams}`;

  console.log('--- LINK DE FALLBACK (NAVEGADOR) ---');
  console.log(fullPrUrl);
  console.log('\n--------------------------------------------');
  process.exit(1);
}

async function createPullRequest() {
  console.log('🔄 Criando Pull Request diretamente via GitHub API...');
  
  const payload = {
    title: prTitle,
    body: bodyText,
    head: currentBranch,
    base: 'main'
  };

  const baseUrl = 'https://github.com/DCoB/base-saas/compare/main...';
  const queryParams = `?expand=1&title=${encodeURIComponent(prTitle)}&body=${encodeURIComponent(bodyText)}`;
  const fullPrUrl = `${baseUrl}${currentBranch}${queryParams}`;

  try {
    const response = await fetch('https://api.github.com/repos/DCoB/base-saas/pulls', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'NodeJS-BaseSaas-PR-Creator',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('\n✅ Pull Request criado com sucesso!');
      console.log('\n============================================');
      console.log('🎉 RESUMO DO PULL REQUEST CRIADO');
      console.log(`📌 Título: ${prTitle}`);
      console.log(`🔗 Link: ${result.html_url}`);
      console.log(`📁 Arquivos Modificados: ${files.length}`);
      console.log(`   - Componentes: ${categories.Componentes.length}`);
      console.log(`   - Estilos: ${categories.Estilos.length}`);
      console.log(`   - Traduções: ${categories.Traducoes.length}`);
      console.log(`   - Outros: ${categories.Outros.length}`);
      console.log('============================================\n');
    } else {
      console.error('\n❌ Falha ao criar Pull Request no GitHub:');
      console.error(`Status: ${response.status} - ${response.statusText}`);
      console.error('Mensagem:', result.message || result);
      
      console.log('\n--- LINK DE FALLBACK GERADO (NAVEGADOR) ---');
      console.log(fullPrUrl);
      console.log('\n--------------------------------------------');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Erro de rede ou comunicação ao criar PR:', error.message);
    console.log('\n--- LINK DE FALLBACK GERADO (NAVEGADOR) ---');
    console.log(fullPrUrl);
    console.log('\n--------------------------------------------');
    process.exit(1);
  }
}

createPullRequest();
