# 🤖 Automação e Catálogo de Agent Skills

Este espaço é o diretório e manual definitivo do **ecossistema de Agent Skills** (extensões autônomas de IA locais) do **BaseSaas**. 

As Skills são ferramentas e diretrizes locais sob a pasta raiz `/skills/` que capacitam agentes de Inteligência Artificial (como o Antigravity) e desenvolvedores humanos a rodar pipelines automatizados de forma padronizada e segura no projeto.

---

## 🗺️ Como Funciona o Ecossistema de Skills?

Cada Skill reside em seu próprio subdiretório dentro de `/skills/` e é composta por:
1.  **`SKILL.md`**: O arquivo de especificação que ensina o Agente de IA como a Skill deve ser interpretada, os pré-requisitos lógicos, a semântica da Skill e as chaves de acionamento. Contém um frontmatter YAML com metadados obrigatórios.
2.  **Scripts de Automação (NodeJS, Shell, etc.)**: Os scripts utilitários que executam fisicamente as operações da Skill no workspace local sem consumo desnecessário de tokens.

---

## 🎨 Como Adicionar uma Nova Skill no Futuro

Para expandir o projeto e criar uma nova automação de IA, siga este passo a passo:

1.  **Criar o Diretório**: Crie uma pasta dentro de `/skills/` com o nome da Skill (ex: `skills/DataBaseMigratorSkill/`).
2.  **Escrever a Especificação (`SKILL.md`)**:
    Crie o arquivo contendo o frontmatter YAML de metadados obrigatórios:
    ```yaml
    ---
    name: NomeDaSuaNovaSkill
    description: Resumo conciso de 1 linha sobre a utilidade desta skill.
    ---
    ```
    Descreva detalhadamente no corpo do Markdown os passos cronológicos que a IA deve tomar e como ela interage com a automação.
3.  **Criar o Script de Automação**: Crie o arquivo executável correspondente (ex: `migrator.js`).
4.  **Registrar neste Catálogo**: Adicione uma referência no tópico sob a seção **3. Catálogo de Skills Disponíveis** abaixo, linkando para o seu novo arquivo de documentação técnica individual.

---

## 📦 Catálogo de Skills Disponíveis

Abaixo estão listadas as automações atualmente integradas e prontas para uso no projeto.

---

### 1. 🤖 [GitHubPRSkill (Auditoria e Criação de Pull Requests)](file:///d:/Projetos/BaseSaas/docs/tutorials/skills/github-pr-skill.md)

O **`GitHubPRSkill`** é o nosso motor inteligente de controle de qualidade e envio contínuo para o repositório central. Ele executa validações obrigatórias de testes unitários e cobertura de documentações antes de criar o PR.

*   👉 **[Acesse o manual completo de uso e configuração do GitHubPRSkill](file:///d:/Projetos/BaseSaas/docs/tutorials/skills/github-pr-skill.md)**

---

### 2. 🛢️ [Template] NovaSkill (Sua Próxima Automação)

Estrutura recomendada para a sua próxima automação de inteligência artificial local:

*   **Caminho do Script**: `skills/NovaSkill/script.js`
*   **Caminho da Especificação**: `skills/NovaSkill/SKILL.md`
*   **Propósito**: Descreva brevemente as metas e o escopo da sua nova skill de IA.
