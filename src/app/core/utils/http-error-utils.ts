import { getSupabaseErrorKey } from "../../shared/utils/supabase-errors.util";

/**
 * Utilitário para mapeamento de status codes HTTP ou mensagens específicas para chaves do Transloco.
 * 
 * @param status Status HTTP da resposta
 * @param message Mensagem opcional de erro
 */
export const mapHttpStatusToTranslationKey = (status: number, message?: string): string => {
  return getSupabaseErrorKey(status, message || '');
};
