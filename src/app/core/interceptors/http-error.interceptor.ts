import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { mapHttpStatusToTranslationKey } from '../utils/http-error-utils';

/**
 * Interceptor HTTP global para tratamento e mapeamento centralizado de erros.
 * Ele escuta qualquer falha em requisições (incluindo as chamadas de API do Supabase redirecionadas pelo HttpClient)
 * e exibe automaticamente mensagens traduzidas em formato de Toaster (PrimeNG).
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const translocoService = inject(TranslocoService);
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = error.message;
      const errorBody = error.error;

      if (typeof errorBody === 'string') {
        try {
          const parsed = JSON.parse(errorBody);
          message = parsed.error_description || parsed.message || parsed.msg || errorBody;
        } catch {
          message = errorBody;
        }
      } else if (errorBody && typeof errorBody === 'object') {
        message = errorBody.error_description || errorBody.message || errorBody.msg || error.message;
      }

      const sanitizedMessage = typeof message === 'string' ? message.trim() : message;
      const errorMessageKey = mapHttpStatusToTranslationKey(error.status, sanitizedMessage);
      const translatedMessage = translocoService.translate(errorMessageKey);

      messageService.add({
        severity: 'error',
        summary: translocoService.translate('TOAST.ERROR') || 'Erro',
        detail: translatedMessage,
        life: 5000,
      });

      return throwError(() => error);
    })
  );
};
