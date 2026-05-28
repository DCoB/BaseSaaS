# ⚙️ Guia de Configuração de Ambiente & Variáveis (Arquitetura)

Este guia explica a arquitetura de gerenciamento de chaves e credenciais no **BaseSaas**, garantindo flexibilidade tanto para desenvolvimento local ágil quanto para fluxos robustos em servidores de produção.

---

## 📂 Onde as Variáveis Ficam Armazenadas?

Toda a nossa aplicação consome as variáveis a partir de uma pasta centralizada:
`src/environments/`

Nesta pasta, residem dois arquivos essenciais gerados e lidos pelo compilador do Angular:
1. `environment.ts`: Contém as chaves para o ambiente padrão / produção.
2. `environment.development.ts`: Contém as chaves para o ambiente de desenvolvimento local.

---

## 🛠️ Método 1: Gerenciamento Manual (Recomendado Localmente)

Se você optou por não ter o arquivo `.env` na raiz do projeto e quer controlar tudo diretamente na pasta do Angular, basta acessar e modificar os valores das chaves dentro de:

* **[environment.development.ts](file:///d:/Projetos/BaseSaas/src/environments/environment.development.ts)**
* **[environment.ts](file:///d:/Projetos/BaseSaas/src/environments/environment.ts)**

Ambos os arquivos devem seguir exatamente esta estrutura de objeto TypeScript:

```typescript
export const environment = {
  production: false, // true no arquivo de produção (environment.ts)
  SUPABASE_URL: 'https://seu-projeto.supabase.co',
  SUPABASE_ANON_KEY: 'sua-chave-anonima-do-supabase',
  GITHUB_TOKEN: 'seu-token-opcional-do-github',
};
```

---

## 🤖 Método 2: Fluxo Automatizado Dinâmico (CI/CD ou Opcional)

Se você preferir um fluxo com segurança reforçada ou automatizada em servidores remotos (onde arquivos no git não podem conter senhas/chaves em texto puro), o projeto possui suporte nativo a build dinâmico:

### 1. Como Funciona a Automação?
Na raiz do projeto, você pode criar um arquivo chamado `.env` contendo as variáveis:
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
GITHUB_TOKEN=seu-token-opcional-do-github
```

### 2. O Script de Build
Ao executar os comandos `npm start` ou `npm run build`, o script automatizado `scripts/set-env.js` é executado antes do compilador principal do Angular.
- Ele lê as chaves do `.env`.
- Ele reconstrói de forma dinâmica os arquivos `environment.ts` e `environment.development.ts` na pasta de compilação, preenchendo-os com os valores corretos.
- **Importante**: Se as chaves já existirem nos arquivos e você não tiver criado um `.env`, o script irá preservar os dados existentes na pasta de compilação sem sobrepô-los com dados vazios.

> [!WARNING]
> Em ambientes automatizados com `.env`, evite modificar os arquivos `src/environments/environment.ts` diretamente à mão, pois o script do build poderá reescrevê-los com base nas suas definições do `.env`.

---

## 🔗 Atalho de Resolução (Alias no TypeScript)

Para evitar caminhos relativos cheios de pontos no seu código (ex: `../../../environments/environment`), o arquivo `tsconfig.json` do projeto configura um alias global.

No seu código, você pode importar as variáveis de ambiente simplesmente usando:
```typescript
import { environment } from '@supabase/environment';
```
O compilador se encarregará de resolver esse atalho apontando para o arquivo correto baseado na sua configuração de compilação (`development` ou `production`).
