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
