# 📚 Documentação Técnica — BaseSaas

Bem-vindo ao diretório de documentação técnica do **BaseSaas**! Este espaço foi projetado para servir como o manual de engenharia definitivo e guia passo a passo de configuração e arquitetura do seu novo SaaS. 

Para facilitar a leitura e consumo, dividimos a nossa documentação em dois processos distintos:

---

## 🗺️ Mapa de Conteúdo

### 📐 1. Arquitetura do Boilerplate (`/docs/architecture`)
*Guias técnicos detalhando o funcionamento interno e decisões de engenharia adotadas no código:*

- ⚙️ **[Configuração de Ambiente](file:///d:/Projetos/BaseSaas/docs/architecture/environment.md)**:
  Como as variáveis são declaradas, resolvidas via aliases globais TypeScript e a integração com scripts dinâmicos de build.
- 🔐 **[Integração do Supabase](file:///d:/Projetos/BaseSaas/docs/architecture/supabase.md)**:
  Como redirecionamos a rede do SDK pelo HttpClient do Angular e centralizamos a interceptação e mapeamento de erros HTTP.
- 🌍 **[Internacionalização & SSR](file:///d:/Projetos/BaseSaas/docs/architecture/i18n.md)**:
  Fluxo de tradução sem hardcoding e a otimização de leitura direta em disco para builds SSR e Prerendering rápidos.
- 💎 **[Estilização & UI Standalone](file:///d:/Projetos/BaseSaas/docs/architecture/ui.md)**:
  Nossos tokens de estilo CSS Premium e a importação standalone dos módulos e serviços de Toasts do PrimeNG.

---

### 🚀 2. Tutoriais & Passo a Passo de Setup (`/docs/tutorials`)
*Tutoriais práticos de configuração passo a passo de ferramentas de terceiros necessárias para colocar o app no ar:*

- 🔑 **[Setup Completo do Supabase](file:///d:/Projetos/BaseSaas/docs/tutorials/supabase-setup.md)**:
  Guia passo a passo desde a criação da conta gratuita e credenciais no Supabase, passando pela criação da tabela `profiles` com triggers SQL automáticos de cadastro, até a vinculação final com o código da aplicação.
- 🤖 **[Automação & Skills de Agente](file:///d:/Projetos/BaseSaas/docs/tutorials/agent-skills.md)**:
  Manual do framework local de IA, detalhando a configuração, propósitos e funcionamento da nossa Skill inteligente de Pull Request (`GitHubPRSkill`).

---

## 🛡️ Regras de Ouro para Contribuição

Para manter esta base extremamente limpa e escalável, todos os desenvolvedores (e IAs parceiras) devem seguir estas regras:
1. **Zero Hardcoding**: Nenhuma string exibida ao usuário deve ir direto no HTML ou TS. Use sempre as chaves localizadas em `public/i18n/` e consuma através do pipe `transloco` ou `TranslocoService`.
2. **Ambiente Isolado**: Nunca commite credenciais de produção no controle de versão. Siga as orientações do guia de ambientes.
3. **Standalone Components**: Todo e qualquer componente deve ser standalone por padrão (evite declaração de NgModules).
