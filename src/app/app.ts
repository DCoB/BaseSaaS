import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { TranslocoModule } from '@jsverse/transloco';
import { NavigationService } from './core/services/navigation.service';
import { environment } from '@supabase/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, TranslocoModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly navigationService = inject(NavigationService);
  
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

