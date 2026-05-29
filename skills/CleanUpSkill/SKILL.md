---
name: CleanUpSkill
description: Realiza varreduras locais de altíssima eficiência para identificar classes CSS órfãs, chaves de tradução i18n inutilizadas e testes unitários rasos no projeto BaseSaaS.
---

# Skill: CleanUp e Auditoria Eficiente de Código

Esta Skill local permite auditar a qualidade do código da base de forma extremamente otimizada, prevenindo o vazamento de chaves de internacionalização, estilos inutilizados e testes unitários rasos ("dummies").

---

## 🛠️ Como Utilizar a Skill

O script `cleanup-auditor.js` está localizado dentro da pasta `skills/CleanUpSkill/` e pode ser executado facilmente no terminal Node.js.

### 1. Execução Padrão (Auditoria Completa)
Roda todas as três auditorias juntas (CSS, i18n e Specs) e cospe um sumário consolidado no terminal:
```bash
node skills/CleanUpSkill/cleanup-auditor.js
```

### 2. Filtrar por Auditoria Específica
Se você deseja rodar apenas uma das verificações para poupar tempo no terminal:
- **Apenas CSS**: `node skills/CleanUpSkill/cleanup-auditor.js --only css`
- **Apenas Traduções (i18n)**: `node skills/CleanUpSkill/cleanup-auditor.js --only i18n`
- **Apenas Testes Unitários**: `node skills/CleanUpSkill/cleanup-auditor.js --only specs`

---

## 🔍 O que Cada Auditoria Analisa

### 🎨 1. Auditoria de Estilos CSS (`--only css`)
*   **Varredura**: Localiza todos os arquivos `.css` dentro de `src/app/`.
*   **Extração**: Compila todas as classes de seletores do CSS utilizando expressões regulares robustas.
*   **Criação de Vínculo**: Procura por referências dessas classes no respectivo arquivo `.html` (e `.ts` se houver) na mesma pasta do componente.
*   **Resultado**: Alerta quais classes CSS foram declaradas na folha de estilos mas nunca foram adicionadas ao template HTML.

### 🌍 2. Auditoria de Chaves de Internacionalização (`--only i18n`)
*   **Varredura**: Carrega o arquivo principal de tradução em Português (`public/i18n/pt.json`).
*   **Achatamento (Flattening)**: Converte o JSON aninhado em caminhos pontuados (ex: `AUTH.LOGIN.TITLE`).
*   **Busca Global**: Escaneia recursivamente todos os arquivos `.html` e `.ts` de componentes buscando referências exatas à chave de tradução.
*   **Resultado**: Alerta quais chaves de tradução estão declaradas no JSON de traduções mas nunca são consumidas ou chamadas nas interfaces do SaaS.

### 🧪 3. Auditoria de Qualidade dos Specs (`--only specs`)
*   **Varredura**: Busca todos os arquivos `.spec.ts` dentro de `src/app/`.
*   **Análise de Profundidade**: Escaneia as asserções e blocos `it(...)`.
*   **Identificação de Dummies**: Identifica arquivos de testes que possuem apenas a asserção padrão e vazia de instanciação (`expect(component).toBeTruthy()`), sem nenhum outro teste customizado ou validação de lógica de negócios.
*   **Resultado**: Aponta quais componentes estão cobertos apenas no papel, estimulando a escrita de testes de comportamento de qualidade.
