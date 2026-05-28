# 🚀 BaseSaas — O Boilerplate Definitivo para o seu Próximo SaaS de Sucesso!

<p align="center">
  <img src="https://img.shields.io/badge/Angular-21.2.0-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 21" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%26%20Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vitest-Test%20Runner-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/i18n-Transloco-blueviolet?style=for-the-badge&logo=internet-explorer&logoColor=white" alt="i18n Transloco" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="Licença MIT" />
</p>

---

## ✨ Da Ideia ao Primeiro Faturamento em Tempo Recorde! 💸

Você já cansou de passar **dias inteiros** configurando conexões com bancos de dados, sistemas de login complexos, rotas lentas e estruturas de testes repetitivas toda vez que tem uma ideia brilhante para um novo SaaS? 🥱

O **BaseSaas** é a solução definitiva de nível comercial. Ele foi meticulosamente projetado com **Angular 21+** e **Supabase** para fornecer uma base comercial ultra-premium, responsiva e pronta para escalar. Você pula a infraestrutura pesada e foca puramente no que coloca dinheiro no seu bolso: **o seu produto e as suas vendas!**

---

## 🛠️ Por que o BaseSaas é a sua Melhor Escolha? (Features de Elite)

| Superpoder | O que faz por você? | Tecnologia |
| :--- | :--- | :--- |
| **🔐 Autenticação Suprema** | Fluxo de segurança completo (Sign Up, Sign In, Redefinição de Senha, Guards e proteção de rotas). | Supabase Auth |
| **🌍 Praticidade Global (i18n)** | Tradução dinâmica completa no idioma ativo do usuário. Nada de strings chumbadas! | @jsverse/transloco |
| **🛡️ Interceptação Inteligente** | Erros de rede do Supabase são traduzidos em tempo de execução e exibidos de forma premium na UI. | Interceptor + Transloco |
| **⚡ Performance Extrema** | Carregamento de páginas dinâmico, navegação instantânea e SSR nativo. | Lazy Loading & Angular SSR |
| **🧪 Testes Blindados** | Infraestrutura ultra-veloz de testes unitários que rodam em milissegundos. | Vitest |
| **💎 UI dos Sonhos** | Arquitetura pensada para design moderno, elegante, responsivo e com glassmorphism. | Variáveis CSS + PrimeNG |
| **🧩 Código Moderno (v21+)** | Componentes independentes, reativos e otimizados para velocidade. | Standalone & Signals |

---

## 📚 Central de Documentação Técnica & Guias

Para manter este repositório leve e focado no seu negócio, toda a documentação avançada e técnica de arquitetura e processos está estruturada de forma limpa na pasta `/docs`:

### 📐 [1. Arquitetura Técnica do Boilerplate (docs/architecture)](file:///d:/Projetos/BaseSaas/docs/architecture)
*Quer entender as decisões de engenharia adotadas no código? Acesse:*
- ⚙️ **[Gerenciamento de Ambientes](file:///d:/Projetos/BaseSaas/docs/architecture/environment.md)**: Como as variáveis são resolvidas e aliases de resolução global.
- 🔐 **[Ponte Supabase <> HttpClient](file:///d:/Projetos/BaseSaas/docs/architecture/supabase.md)**: Redirecionamento avançado de rede e tratamento de erros integrado.
- 🌍 **[Internacionalização & SSR](file:///d:/Projetos/BaseSaas/docs/architecture/i18n.md)**: Como funciona o i18n sem requisições HTTP locais no build.
- 💎 **[Aparência & Componentes Standalone](file:///d:/Projetos/BaseSaas/docs/architecture/ui.md)**: Estilização nativa por CSS Custom Properties e PrimeNG.

### 🚀 [2. Passo a Passo de Setup Prático (docs/tutorials)](file:///d:/Projetos/BaseSaas/docs/tutorials)
*Precisa de ajuda para conectar as ferramentas e colocar o app para rodar? Acesse:*
- 🔑 **[Guia Passo a Passo do Supabase](file:///d:/Projetos/BaseSaas/docs/tutorials/supabase-setup.md)**: Desde o cadastro gratuito no Supabase, passando pela criação automática de tabelas (`profiles`) via triggers SQL, até a configuração de chaves finais no seu editor para o app funcionar instantaneamente.

---

## ⚡ Guia de Início Rápido (3 Passos)

### 1. Clonar e Instalar
```bash
git clone https://github.com/seu-usuario/base-saas.git
cd base-saas
npm install
```

### 2. Configurar as Chaves no Editor
Acesse o arquivo **[environment.development.ts](file:///d:/Projetos/BaseSaas/src/environments/environment.development.ts)** e adicione sua URL e chave anônima obtidas no painel do Supabase (consulte o [Guia Passo a Passo do Supabase](file:///d:/Projetos/BaseSaas/docs/tutorials/supabase-setup.md) para ajuda visual).

### 3. Executar
```bash
npm start
```
Abra [http://localhost:4200](http://localhost:4200) e veja a sua nova plataforma decolando! 🚀

---

<p align="center">
  Feito com 💜 por desenvolvedores apaixonados por SaaS e velocidade. Se esse projeto te ajudou a economizar dias de trabalho, não esqueça de deixar uma <b>⭐ Star</b> no repositório!
</p>
