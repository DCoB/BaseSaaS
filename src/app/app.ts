// Angular Modules
import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Third-party Libraries
import { ToastModule } from 'primeng/toast';
import { TranslocoModule } from '@jsverse/transloco';

// Application Services
import { NavigationService } from './core/services/navigation.service';

// Shared Components
import { TopbarComponent } from './shared/components/topbar/topbar.component';

// Environment
import { environment } from '@supabase/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, TranslocoModule, TopbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly navigationService = inject(NavigationService);
  
  constructor() {
    // Remove a classe de loading do idioma no client-side após o bootstrap do Angular
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('lang-loading');
    }
  }
  
  // Exposto ao template para controlar a exibição da tela de carregamento global
  protected readonly isAppLoading = this.navigationService.isAppLoading;

  // Analisa se as credenciais do Supabase estão configuradas ou se permanecem vazias/placeholders
  protected readonly isConfigMissing = computed(() => {
    const url = environment.SUPABASE_URL;
    const key = environment.SUPABASE_ANON_KEY;
    
    return !url || !key || 
      url.includes('placeholder') || 
      key.includes('placeholder') || 
      url.includes('sua-url') ||
      key.includes('sua-chave');
  });
}

