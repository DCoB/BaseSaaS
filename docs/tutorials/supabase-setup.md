# 🔑 Guia Passo a Passo: Configuração do Supabase

Este tutorial prático guiará você desde a criação da sua conta no **Supabase** até a configuração final do banco de dados e autenticação para funcionar perfeitamente com a aplicação **BaseSaas**.

---

## 🛠️ Passo 1: Criar sua Conta e Projeto no Supabase

1. Acesse o site oficial do [Supabase](https://supabase.com) e clique em **Start your project** ou **Sign In**.
2. Faça login utilizando sua conta do **GitHub** (recomendado para maior integração).
3. No painel principal do Supabase, clique no botão **New Project** (Novo Projeto).
4. Selecione uma **Organização** (ou crie uma gratuita).
5. Preencha as informações do seu projeto:
   - **Name**: Nome do seu SaaS (ex: `MeuSaaS`).
   - **Database Password**: Escolha uma senha segura para o banco de dados PostgreSQL e anote-a.
   - **Region**: Escolha a região mais próxima dos seus clientes (ex: `South America (São Paulo) - sa-east-1`).
   - **Pricing Plan**: Selecione o plano **Free** (Gratuito).
   - **Security** (Configurações de Segurança):
     **Configuração para Execução Mínima**:
     Para que o projeto funcione e se conecte imediatamente sem configurações manuais de banco adicionais, defina as seguintes opções:
     - **Enable Data API**: **Marcado (Obrigatório)** — Habilita a API RESTful para o schema `public` (necessário para a biblioteca client `supabase-js`).
     - **Automatically expose new tables**: **Marcado (Obrigatório para o setup mínimo)** — Expõe novas tabelas por padrão à chave pública anon, evitando que você precise criar concessões de privilégio em SQL manualmente.
     - **Enable automatic RLS**: **Desmarcado (Recomendado para desenvolvimento inicial)** — Evita que novas tabelas fiquem trancadas pelo Row Level Security (RLS) até que você configure políticas de segurança específicas.
6. Clique em **Create new project** e aguarde alguns minutos enquanto o Supabase provisiona seu banco de dados, APIs e containers de autenticação.

---

## 📂 Passo 2: Coletar as Credenciais do Projeto

Assim que o projeto for criado, você estará na tela inicial do dashboard (ou pode clicar no ícone de casa **Project Overview** no topo do menu lateral esquerdo):

1. Logo no cabeçalho ao lado do nome do seu projeto (ex: `MeuSaaS`), localize e clique no botão **Copy** (com ícone de link e uma seta para baixo).
2. No menu suspenso que abrirá, copie as seguintes credenciais:
   - **Project URL**: Copie a URL gerada (ex: `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`).
   - **Publishable key**: Copie a chave pública do projeto (também conhecida como chave `anon public`, que é segura para ser exposta no navegador).

> [!NOTE]
> **Método Alternativo**: Você também pode coletar essas credenciais a qualquer momento acessando a engrenagem no canto inferior esquerdo em **Project Settings** > **API**.

Anote estas duas credenciais. Nós as usaremos no Passo 5!

---

## 🛢️ Passo 3: Configurar a Tabela de Perfis (`profiles`) no Banco de Dados

Nosso boilerplate exibe informações personalizadas no Dashboard, como nome completo, avatar e status do plano premium do usuário. Para armazenar e sincronizar esses dados automaticamente com o sistema de autenticação, criaremos uma tabela `profiles` no PostgreSQL:

1. No menu lateral esquerdo, clique em **SQL Editor**.
2. Clique em **New Query** (Nova Consulta).
3. Cole o script SQL abaixo, que cria a tabela, define as permissões de segurança de linha (RLS) e configura um Trigger para criar o perfil do usuário automaticamente assim que ele se cadastrar na aplicação:

```sql
-- 1. Criar a tabela 'profiles' associada aos usuários do Supabase Auth
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Habilitar o Row Level Security (RLS) para segurança das linhas
alter table public.profiles enable row level security;

-- 3. Criar Políticas de Acesso
-- Permitir que qualquer usuário visualize perfis públicos
create policy "Perfis são visíveis publicamente"
  on public.profiles for select
  using (true);

-- Permitir que apenas o próprio usuário modifique o seu perfil
create policy "Usuários podem modificar seu próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- 4. Função Trigger para criar o perfil do usuário automaticamente no cadastro
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- 5. Vincular a função como um Trigger na tabela auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

4. Clique no botão **Run** (Executar) no canto inferior direito para rodar o script.
5. Pronto! Agora seu banco de dados está estruturado e automatizado para cadastros.

---

## 🔐 Passo 4: Habilitar e Configurar a Autenticação (Auth)

1. No menu lateral, clique em **Authentication** > **Providers**.
2. **Email**:
   - Garanta que o provedor de **Email** esteja **Enabled** (Habilitado).
   - Opcional: Se quiser pular a verificação de e-mail localmente durante os testes, você pode desabilitar a opção _Confirm email_ (mas lembre-se de reativá-la em produção!).

---

## ⚙️ Passo 5: Configurar as Credenciais no Aplicativo

Agora que seu ecossistema do Supabase está pronto, vincule-o ao código do seu app:

1. No seu computador, abra a pasta do projeto.
2. Acesse a pasta `/src/environments` e abra o arquivo correspondente ao seu ambiente:
   - Para desenvolvimento local: **[environment.development.ts](file:///d:/Projetos/BaseSaas/src/environments/environment.development.ts)**
   - Para produção: **[environment.ts](file:///d:/Projetos/BaseSaas/src/environments/environment.ts)**
3. Substitua os placeholders vazios pelas credenciais reais anotadas no Passo 2:

```typescript
export const environment = {
  production: false, // ou true se for environment.ts
  SUPABASE_URL: 'https://xxxxxxxxxxxxxxxxxxxx.supabase.co', // Sua URL real
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Sua chave Anon real
  GITHUB_TOKEN: '',
};
```

4. Salve o arquivo.

---

## 🚀 Passo 6: Rodar e Validar

1. No terminal do projeto, inicialize o servidor de desenvolvimento:
   ```bash
   npm start
   ```
2. Abra a aplicação no navegador em `http://localhost:4200`.
3. Tente se cadastrar na tela de **Register** e fazer o login.
4. Ao entrar, acesse a tabela `profiles` no painel do Supabase para conferir os dados gravados automaticamente!
