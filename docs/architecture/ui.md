# 💎 Estilização & Componentes PrimeNG (Arquitetura)

O **BaseSaas** adota uma fundação estética moderna e sofisticada, desenhada para criar uma sensação estética premium imediata (*WOW factor*) e oferecer uma experiência responsiva e limpa.

---

## 🎨 Sistema de Design & Variáveis CSS

Para evitar a rigidez de dependências pesadas e facilitar customizações rápidas, toda a nossa paleta de cores, tipografia, bordas e espaçamentos é regida através de **Variáveis CSS Customizadas** (*CSS Custom Properties*).

Elas estão declaradas no arquivo central de estilos:
`src/styles.css`

### Principais Tokens Estéticos:
- **Cores Harmoniosas de Destaque**: Tons sofisticados de cinza escuro, carvão e o verde elegante de alto contraste do Supabase (`#3ecf8e`).
- **Glassmorphic Cards**: Efeitos de desfoque de fundo e bordas translúcidas finas para criar profundidade e elegância:
  ```css
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  ```
- **Micro-animações**: Efeitos de transição suaves em botões e estados de hover que conferem interatividade dinâmica e viva à interface.

---

## 🧩 Integração Limpa com PrimeNG

O PrimeNG é utilizado para nos fornecer componentes funcionais complexos e de altíssima acessibilidade (como overlays, caixas de diálogo e notificações do tipo Toasters).

### 1. Injeção Standalone Directa
Seguindo as diretrizes rígidas do Angular 20+, importamos os módulos do PrimeNG de forma focada e granular apenas onde são necessários. 

Por exemplo, no componente principal `App` (`src/app/app.ts`), importamos e declaramos o `ToastModule` diretamente em `imports`:
```typescript
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, TranslocoModule],
})
```

E renderizamos o elemento de forma simples no template `app.html`:
```html
<p-toast position="bottom-center"></p-toast>
```

---

## 🔔 Serviços de Notificação Globais

O PrimeNG nos fornece os serviços `MessageService` e `ConfirmationService` para gerenciar Toasts e modais de confirmação na aplicação inteira de forma dinâmica.

### 1. Registro Centralizado
Para garantir que estes serviços sejam injetados como singletons e fiquem disponíveis em qualquer lugar do aplicativo sem declarações duplicadas, eles estão registrados no array de `providers` em:
`src/app/app.config.ts`

```typescript
import { MessageService, ConfirmationService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    ConfirmationService,
    // ...
  ]
};
```

### 2. Como usar o Toast em qualquer Serviço ou Componente?
Para exibir uma notificação para o usuário, basta injetar o `MessageService` do PrimeNG:

```typescript
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export class MeuServico {
  private readonly messageService = inject(MessageService);

  sucesso() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Operação concluída com sucesso!'
    });
  }
}
```

Isso garante uma UI consistente, modular e extremamente profissional ao longo de todo o fluxo do seu SaaS!

---

## 🎨 Sistema de Ícones Padrão (PrimeIcons)

Para manter a consistência visual, leveza de renderização e compatibilidade nativa com os componentes PrimeNG, o **BaseSaas** adota a biblioteca **PrimeIcons** como seu padrão oficial de iconografia.

### 🔌 Carregamento e Instalação
O carregamento das fontes e estilos de ícones está centralizado no topo do arquivo global de estilização:
**[src/styles.css](file:///d:/Projetos/BaseSaas/src/styles.css)**
```css
@import "primeicons/primeicons.css";
```

### 🛠️ Como Utilizar Ícones no Código?
Qualquer ícone pode ser renderizado usando tags semânticas de itálico `<i>` com as classes `pi` (base do PrimeIcons) e `pi-[nome-do-icone]`:

```html
<!-- Exemplo 1: Ícone de Sair / Logout -->
<i class="pi pi-sign-out" aria-hidden="true"></i>

<!-- Exemplo 2: Ícone de Globo para Idiomas -->
<i class="pi pi-globe" aria-hidden="true"></i>

<!-- Exemplo 3: Ícone do Google para Login Social -->
<i class="pi pi-google" aria-hidden="true"></i>
```

### 🔍 Onde Encontrar Ícones Disponíveis?
A biblioteca PrimeIcons possui centenas de ícones modernos prontos para uso comercial. Para pesquisar ícones, buscar classes e conferir a listagem interativa completa, consulte a documentação oficial:
👉 **[Galeria e Listagem Oficial de Ícones do PrimeIcons](https://primeng.org/icons)**

---

## 🖼️ Customização de Logotipo & Ícone do App (Branding)

Toda a identidade visual do **BaseSaas** foi projetada para ser alterada de forma centralizada em segundos. O logotipo padrão e o favicon da aplicação estão mapeados na pasta de arquivos estáticos públicos.

### 📂 Localização do Arquivo de Logo
O arquivo de imagem oficial da marca está localizado na pasta pública raiz do projeto:
`public/logo.jpg`

Este arquivo é compilado e servido diretamente na raiz da aplicação graças à configuração de ativos (`assets`) declarada no **[angular.json](file:///d:/Projetos/BaseSaas/angular.json)**:
```json
"assets": [
  {
    "glob": "**/*",
    "input": "public"
  }
]
```

---

### 🔄 Como Alterar o Logotipo em 3 Passos Simples

#### Passo 1: Substituir o Arquivo Físico
Para manter as referências padrão sem alterar nenhuma linha de código, basta substituir a imagem em **`public/logo.jpg`** por sua própria logo (preferencialmente mantendo a proporção quadrada, ex: `512x512px` ou `1024x1024px`).

#### Passo 2 (Opcional): Alterar o Formato da Imagem (Ex: PNG ou SVG)
Se você preferir utilizar uma imagem com fundo transparente (`.png`) ou vetorial (`.svg`), salve seu arquivo na pasta `public/` (ex: `public/logo.svg`) e atualize os arquivos que o referenciam:

1. **Favicon e Ícone do Navegador ([src/index.html](file:///d:/Projetos/BaseSaas/src/index.html)):**
   ```html
   <link rel="icon" type="image/svg+xml" href="logo.svg" />
   ```
2. **Logo na Tela de Autenticação ([login.component.html](file:///d:/Projetos/BaseSaas/src/app/features/auth/login/login.component.html)):**
   ```html
   <img src="/logo.svg" alt="SuaMarca Logo" class="auth-logo" />
   ```
3. **Logo na Barra Superior Global ([topbar.component.html](file:///d:/Projetos/BaseSaas/src/app/shared/components/topbar/topbar.component.html)):**
   ```html
   <img src="/logo.svg" alt="SuaMarca Logo" class="brand-logo" />
   ```

#### Passo 3: Limpar Cache de Compilação
Caso a logo antiga ainda apareça na tela devido ao cache rígido de compilação ou de service workers, pare o servidor local de desenvolvimento e execute:
```bash
npm run build
npm start
```
Isso forçará a recompilação e a cópia limpa do novo logotipo da pasta `public/` para os bundles finais da sua aplicação! 🚀
