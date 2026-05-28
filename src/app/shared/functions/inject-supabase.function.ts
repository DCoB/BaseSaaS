import { inject } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase/supabase.service';

/**
 * Função utilitária funcional para injeção limpa e direta do cliente Supabase
 * em qualquer componente standalone, guard ou serviço Angular.
 */
export const InjectSupabase = () => {
  const supabaseService = inject(SupabaseService);
  return supabaseService.supabase;
};
