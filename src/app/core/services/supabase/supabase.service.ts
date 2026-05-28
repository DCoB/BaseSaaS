import { Injectable, inject } from '@angular/core';
import { environment } from '@supabase/environment';
import { SupabaseClient } from '@supabase/supabase-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly http = inject(HttpClient);
  
  supabase: SupabaseClient;

  constructor() {
    /**
     * Inicialização do cliente Supabase integrada ao HttpClient do Angular.
     * Isso redireciona todas as chamadas de fetch nativas do SDK do Supabase
     * pelo pipeline de interceptores do Angular, permitindo centralizar
     * interceptação de tokens, exibição de toasters de erro e tratamento global.
     */
    this.supabase = new SupabaseClient(environment.SUPABASE_URL, environment.SUPABASE_ANON_KEY, {
      global: {
        fetch: async (url, options) => {
          try {
            const response = await lastValueFrom(
              this.http.request(options?.method || 'GET', url.toString(), {
                body: options?.body,
                headers: new HttpHeaders(options?.headers as any),
                observe: 'response',
                responseType: 'text', // Permite que interceptores acessem o corpo como texto bruto se necessário
              })
            );

            return new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: new Headers(
                response.headers.keys().reduce((acc: any, key: any) => ({ ...acc, [key]: response.headers.get(key) }), {})
              ),
            });
          } catch (error: any) {
            if (error.status) {
              const errorBody = typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
              return new Response(errorBody, {
                status: error.status,
                statusText: error.statusText,
                headers: new Headers(
                  error.headers?.keys().reduce((acc: any, key: any) => ({ ...acc, [key]: error.headers.get(key) }), {}) || {}
                ),
              });
            }
            throw error;
          }
        },
      },
    });
  }
}
