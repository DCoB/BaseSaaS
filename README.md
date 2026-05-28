# 🚀 BaseSaas — O Boilerplate Definitivo para seu Próximo SaaS de Sucesso!

<p align="center">
  <img src="https://img.shields.io/badge/Angular-21.2.0-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 21" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%26%20Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vitest-Test%20Runner-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/AI%20Agents-Pre--configured-blueviolet?style=for-the-badge&logo=openai&logoColor=white" alt="Agentes de IA Prontos" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="Licença MIT" />
</p>

---

## ✨ Fala, Dev! Bem-vindo(a) ao Futuro do Desenvolvimento SaaS 

Você já cansou de passar **dias** configurando rotas, sistemas de login, conexão com banco de dados, bibliotecas de componentes e toda a infraestrutura de testes toda vez que tem uma ideia brilhante de SaaS? 🥱

O **BaseSaas** chegou para acabar com isso! Este é o boilerplate de elite absoluto, construído com **Angular 21+**, **Supabase** e integrado com **Agentes de Inteligência Artificial** inteligentes e prontos para codificar por você. É a fundação perfeita, rápida e robusta que vai te levar da ideia à primeira venda em tempo recorde. 💸

Tudo isso desenhado com as melhores e mais modernas práticas do mercado e um tom **noob-friendly** para você não se perder em nenhum passo!

---

## 🛠️ O que já vem na caixa? (Features de Elite)

| Feature | O que faz por você? | Tecnologia |
| :--- | :--- | :--- |
| **🤖 IA & Agentes Prontos** | Configurações de agentes de elite e Skills prontas para acelerar seu desenvolvimento. | Gemini / Antigravity |
| **🔐 Auth Suprema** | Fluxo de autenticação completo (Sign Up, Sign In, Redefinição de Senha, Guards). | Supabase Auth |
| **⚡ Performance Máxima** | Gerenciamento de rotas robusto, dinâmico e carregamento sob demanda. | Lazy Loading & Angular Router |
| **🧪 Testes Blindados** | Infraestrutura ultra-rápida de testes unitários configurada e rodando instantaneamente. | Vitest |
| **💎 UI dos Sonhos** | Arquitetura pensada para design responsivo, moderno e de alto impacto. | CSS Variáveis + PrimeNG |
| **🧩 Arquitetura v21+** | Componentes independentes por padrão, gerenciamento de estado moderno e puro. | Standalone Components & Signals |

---

## 🧠 Superpoder Especial: Agentes de IA & Workflows Integrados

Esse não é só mais um template de código. O **BaseSaas** é uma **estação de trabalho autônoma**. 

O projeto conta com configurações de agentes (`AGENTS.md` e regras dedicadas) que ensinam a IA a:
1. **Seguir as diretrizes do projeto de olhos fechados** (uso obrigatório de Signals, OnPush, sem hardcoding de textos, padrões rígidos de i18n).
2. **Utilizar Skills Customizadas** para automatizar tarefas como criação de Pull Requests, aplicação de guidelines de texto e criação de componentes Angular perfeitos.
3. **Manter a integridade de segredos** (nunca alterar arquivos de environment diretamente, gerenciar tudo via `.env`).

---

## 🚀 Guia de Início Rápido (Noob-Friendly!)

Seja você um sênior calejado ou alguém que está criando seu primeiro projeto, este guia vai te colocar para rodar em menos de 5 minutos!

### 1. Clonar e Instalar Dependências

Primeiro, traga essa máquina para o seu computador e instale as dependências:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/base-saas.git

# Acesse a pasta
cd base-saas

# Instale as dependências
npm install
```

### 2. Configurar o Supabase (As Chaves Mágicas 🔑)

Crie um arquivo chamado `.env` na raiz do projeto e adicione suas credenciais do Supabase:

```env
SUPABASE_URL=https://sua-url-do-supabase.supabase.co
SUPABASE_KEY=seu-token-anonimo-do-supabase
```

> [!IMPORTANT]
> **REgra de Ouro**: Nunca edite os arquivos `src/environments/environment.ts` diretamente! Nosso build lê as chaves mágicas do arquivo `.env` e gera os ambientes dinamicamente. Segurança em primeiro lugar! 🛡️

### 3. Rodar o Servidor Local

Com tudo pronto, inicialize o servidor de desenvolvimento:

```bash
npm start
```

Abra [http://localhost:4200](http://localhost:4200) no seu navegador e contemple a sua nova base premium funcionando! 🚀

---

## 🧪 Rodando os Testes (Sem Medo de Quebrar nada!)

Escrever testes no Angular nunca foi tão rápido. Substituímos o Karma antigo pelo **Vitest**, garantindo execuções de testes em milissegundos!

```bash
# Executa todos os testes unitários com Vitest
npm test
```

---

## 📐 Padrões de Código e Boas Práticas (Para Codar como um Pro)

Para manter este projeto lindo e escalável, siga sempre estas regras de ouro:

* **Sempre Standalone Component**: Nada de NgModules complexos! Cada componente se resolve sozinho.
* **Sinalize seu Estado**: Use `signals()` para dados mutáveis e `computed()` para dados calculados. Nada de gerenciar estados de forma antiga.
* **OnPush por Padrão**: Configure `changeDetection: ChangeDetectionStrategy.OnPush` em todos os seus componentes para performance extrema.
* **Nada de Hardcoding**: Qualquer texto que o usuário final vai ver deve ir para os arquivos de tradução em `public/i18n/` (`pt.json`, `en.json`, `es.json`) utilizando `@jsverse/transloco`. 🌍

---

## 🤝 Contribuição e Licença

Este projeto está sob a licença **MIT**. Sinta-se livre para clonar, alterar, usar no seu SaaS comercial e faturar milhões! 🚀

---

<p align="center">
  Feito com 💜 por desenvolvedores apaixonados por produtividade e IA. Se esse projeto te ajudou, não esqueça de deixar uma <b>⭐ Star</b> no repositório!
</p>
