# 🔐 Integração & Tratamento do Supabase (Arquitetura)

O **BaseSaas** adota uma abordagem de nível sênior para gerenciar a comunicação com o **Supabase**. Em vez de acoplar o SDK isoladamente ao componente ou criar requisições assíncronas soltas, integramos o fluxo de rede do Supabase ao pipeline HTTP nativo do Angular.

---

## 🚀 Arquitetura de Comunicação Unificada

### O Redirecionamento Fetch (HttpClient)
No arquivo `src/app/core/services/supabase/supabase.service.ts`, instanciamos o `SupabaseClient` redefinindo o comportamento global da função `fetch` nativa do SDK:

```typescript
this.supabase = new SupabaseClient(environment.SUPABASE_URL, environment.SUPABASE_ANON_KEY, {
  global: {
    fetch: async (url, options) => {
      // Redireciona todas as chamadas internas do SDK do Supabase pelo HttpClient do Angular!
      return new Response(...);
    }
  }
});
```

### 🎯 Por que fazer isso?
Ao forçar as requisições do SDK do Supabase a trafegarem pelo `HttpClient` do Angular, ganhamos superpoderes instantâneos:
1. **Interceptação Global**: Todos os interceptores configurados no Angular (`app.config.ts`) escutam e tratam as requisições do Supabase de forma nativa.
2. **Monitoramento e Auditoria**: É possível inspecionar de forma granular cabeçalhos, rotas e payloads em um único ponto central do aplicativo.
3. **Tratamento de Falhas Unificado**: Erros do Supabase são transformados e interceptados do mesmo jeito que qualquer outra chamada HTTP no ecossistema do seu app.

---

## 🛡️ O Pipeline de Tratamento de Erros

Quando uma operação falha no banco de dados ou no fluxo de autenticação do Supabase (por exemplo, credenciais de login inválidas ou e-mail não confirmado), ela é capturada pelo nosso interceptor central:

### 1. `httpErrorInterceptor` (`src/app/core/interceptors/http-error.interceptor.ts`)
O interceptor monitora requisições HTTP ativas e, em caso de falha, delega a formatação do erro ao mapeador.

### 2. Mapeador de Erros do Supabase (`src/app/shared/utils/supabase-errors.util.ts`)
O arquivo de utilitários de erros analisa a mensagem do servidor ou o código de status HTTP retornado pelo Supabase (ex: `400 Bad Request`, `401 Unauthorized`) e o converte em uma chave semântica de tradução:

```typescript
// Mapeamento interno simplificado
if (message.includes('Invalid login credentials')) {
  return 'SUPABASE_ERRORS.INVALID_LOGIN_CREDENTIALS';
}
if (message.includes('Email not confirmed')) {
  return 'SUPABASE_ERRORS.EMAIL_NOT_CONFIRMED';
}
```

### 3. Exibição Dinâmica (Toasts Globais)
Depois que a chave é mapeada, o serviço global de mensagens (`MessageService` do PrimeNG) é acionado para renderizar na tela do usuário um Toast de alerta estilizado no idioma ativo configurado na aplicação:

```typescript
// O interceptor obtém a tradução instantânea da chave mapeada
const translatedMessage = translocoService.translate(errorKey);
messageService.add({ severity: 'error', summary: 'Erro', detail: translatedMessage });
```

Essa robustez impede que mensagens técnicas em inglês feias ou vazamentos de strings do servidor cheguem de forma indelicada ao usuário final, mantendo o seu SaaS sempre impecável e amigável.
