// Angular Modules
import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// Third-party Libraries
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { MessageService, ConfirmationService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

// Application Modules & Services
import { routes } from './app.routes';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { AuthService } from './core/services/auth/auth.service';
import { TranslocoHttpLoader } from './transloco-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    ConfirmationService,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideTransloco({
      config: {
        availableLangs: ['pt', 'en', 'es'],
        defaultLang: (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideAppInitializer(() => inject(AuthService).load()),
    provideAppInitializer(() => {
      const transloco = inject(TranslocoService);
      const lang = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en';
      transloco.setActiveLang(lang);
      return firstValueFrom(transloco.load(lang));
    })
  ],
};
