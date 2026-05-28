import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  getTranslation(lang: string) {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<Translation>(`/i18n/${lang}.json`);
    } else {
      try {
        const fs = require('fs');
        const path = require('path');
        // Durante o prerender, lê direto da pasta de origem public/i18n
        const filePath = path.join(process.cwd(), 'public/i18n', `${lang}.json`);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const translation = JSON.parse(fileContent);
        return of(translation);
      } catch (err) {
        console.error('Erro ao ler arquivo i18n no servidor:', err);
        return this.http.get<Translation>(`/i18n/${lang}.json`);
      }
    }
  }
}
