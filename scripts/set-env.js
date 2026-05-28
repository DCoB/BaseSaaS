const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Carrega variáveis do .env
dotenv.config();

const environmentsDir = path.join(__dirname, '../src/environments');

// Garante que o diretório exista
if (!fs.existsSync(environmentsDir)) {
  fs.mkdirSync(environmentsDir, { recursive: true });
}

// Chaves que a nossa aplicação precisa
const requiredKeys = ['production', 'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'GITHUB_TOKEN'];

// Mapeia chaves do process.env para defaults se não fornecidas
const defaultEnvValues = {
  production: process.env.production === 'true' || false,
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || ''
};

const targetFiles = [
  path.join(environmentsDir, 'environment.ts'),
  path.join(environmentsDir, 'environment.development.ts')
];

targetFiles.forEach(file => {
  let envValues = {};

  // Se o arquivo já existe, lê e mescla preservando o que já existe
  if (fs.existsSync(file)) {
    try {
      const existingContent = fs.readFileSync(file, 'utf8');
      const parsedKeys = {};
      const matchRegex = /(\w+)\s*:\s*(['"`](.*?)['"`]|true|false|\d+)/g;
      let match;

      while ((match = matchRegex.exec(existingContent)) !== null) {
        const key = match[1];
        let rawVal = match[2];
        let cleanVal = rawVal;

        if (rawVal.startsWith("'") || rawVal.startsWith('"') || rawVal.startsWith("`")) {
          cleanVal = match[3]; // Valor limpo dentro das aspas
        } else if (rawVal === 'true') {
          cleanVal = true;
        } else if (rawVal === 'false') {
          cleanVal = false;
        } else if (!isNaN(Number(rawVal))) {
          cleanVal = Number(rawVal);
        }

        parsedKeys[key] = cleanVal;
      }

      // Preserva exatamente as chaves que já existem no arquivo
      envValues = { ...parsedKeys };
    } catch (e) {
      console.warn(`⚠️ Não foi possível analisar o arquivo existente ${file}. Criando um novo do zero.`);
    }
  }

  // Adiciona apenas as chaves requeridas que não existem no arquivo
  requiredKeys.forEach(key => {
    if (!(key in envValues)) {
      envValues[key] = defaultEnvValues[key];
    }
  });

  // Função auxiliar para formatar os valores
  const formatValue = (val) => {
    if (typeof val === 'boolean') {
      return val;
    }
    if (typeof val === 'number') {
      return val;
    }
    const escaped = String(val).replace(/'/g, "\\'");
    return `'${escaped}'`;
  };

  // Gera o conteúdo final formatado de forma dinâmica para preservar todas as chaves
  const entryLines = Object.entries(envValues).map(([key, val]) => {
    return `  ${key}: ${formatValue(val)},`;
  });

  const envConfigFile = `export const environment = {
${entryLines.join('\n')}
};
`;

  fs.writeFileSync(file, envConfigFile);
  console.log(`✅ Arquivo de ambiente processado com sucesso: ${file}`);
});
