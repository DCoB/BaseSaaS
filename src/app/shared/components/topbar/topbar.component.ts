// Angular Modules
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Third-party Libraries
import { Select } from 'primeng/select';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

// Application Services
import { AuthService } from '../../../core/services/auth/auth.service';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-topbar',
  imports: [
    CommonModule,
    FormsModule,
    Select,
    TranslocoModule,
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  private readonly translocoService = inject(TranslocoService);
  private readonly authService = inject(AuthService);

  // Expor usuário atual para exibição do avatar/perfil
  protected readonly user = this.authService.currentUser;

  // Opções de idiomas com bandeiras correspondentes
  protected readonly languages: LanguageOption[] = [
    { code: 'pt', name: 'TOPBAR.PORTUGUESE', flag: '🇧🇷' },
    { code: 'en', name: 'TOPBAR.ENGLISH', flag: '🇺🇸' },
    { code: 'es', name: 'TOPBAR.SPANISH', flag: '🇪🇸' },
  ];

  // Sinal reativo para armazenar a opção selecionada atualmente
  protected readonly selectedLang = signal<LanguageOption>(
    this.languages.find((l) => l.code === this.translocoService.getActiveLang()) || this.languages[0]
  );

  /**
   * Disparado ao alterar a seleção do idioma no PrimeNG Select
   */
  protected onLangChange(event: { value: LanguageOption }): void {
    if (event.value) {
      this.translocoService.setActiveLang(event.value.code);
      this.selectedLang.set(event.value);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('lang', event.value.code);
      }
    }
  }

  /**
   * Efetua o logout do usuário atual do sistema
   */
  protected logout(): void {
    this.authService.logout();
  }
}
