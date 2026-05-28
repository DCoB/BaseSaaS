---
name: GitHubPRSkill
description: Realiza a análise rápida de alterações na branch atual e dispara a criação automatizada de Pull Requests no repositório DCoB/base-saas.
---

# Skill: Análise Rápida de Modificações e Pull Request Sucinto

Esta Skill local permite verificar de forma ultra-eficiente as alterações feitas na branch atual em relação à branch `main`, gerando um sumário conciso e um link direto ou criação automatizada via API de Pull Request no GitHub para o repositório **DCoB/base-saas**.

---

## 🚀 Como Funciona a Skill

Para evitar o processamento excessivo de arquivos longos de diff (o que desperdiça tokens desnecessariamente), esta Skill adota uma abordagem direta baseada em metadados do Git e execução de script local.

### Passos de Execução para a IA:

1.  **Verificar Regras Específicas do Projeto (Hook Dinâmico)**:
    Antes de mais nada, verifique se existe um arquivo chamado `.pr-skill-rules.md` na raiz do projeto. Se ele existir, leia suas instruções e certifique-se de executar TODAS as diretrizes de PR ali definidas ANTES de prosseguir para o sumário.

2.  **Validação Obrigatória de Testes Unitários (Pre-flight Checks)**:
    - Os testes unitários **devem obrigatoriamente passar com 100% de sucesso**.
    - O script `pr-creator.js` executará `npm run test` programaticamente antes de continuar. Se houver falha nos testes, a execução será abortada.

3.  **Auditoria de Arquivos Modificados e Cobertura de Testes (.spec.ts)**:
    - O script irá verificar se cada arquivo lógico de componente ou serviço modificado, adicionado ou deletado possui a sua correspondente alteração/criação/exclusão de arquivo de teste `.spec.ts`.
    - Caso algum arquivo novo tenha sido criado sem o teste unitário correspondente, a conformidade falhará e a criação do PR será bloqueada até a devida criação do teste.

4.  **Auditoria de Atualização de Documentação**:
    - Caso haja modificações em infraestrutura (Supabase, pacotes, variáveis de ambiente ou scripts), o script avaliará se houveram modificações correspondentes em arquivos de documentação markdown (`.md` ou `README.md`).

5.  **Executar a Automação Local**:
    Use a ferramenta `run_command` para executar a ferramenta local da Skill:
    ```bash
    node skills/GitHubPRSkill/pr-creator.js
    ```
    Isso executará toda a suíte de validações e, caso o token do GitHub esteja configurado e todas as validações passem, criará o Pull Request instantaneamente na API do GitHub do repositório `DCoB/base-saas`.

6.  **Apresentar o Resultado ao Usuário**:
    - Se o PR foi criado diretamente, apresente o título, link do PR gerado e as auditorias agregadas de cobertura de testes e documentações.
    - Se o token do GitHub não foi encontrado, apresente a análise de auditoria gerada localmente e exiba o link amigável pré-preenchido de fallback para que o usuário possa clicar e criar o PR no navegador com um clique.

---

## 🛠️ Script Utilitário Automatizado (IA Engine)

- Caminho: `skills/GitHubPRSkill/pr-creator.js`
- Execução: `node skills/GitHubPRSkill/pr-creator.js`
