export const SUPABASE_ERROR_MAP: Record<string | number, string> = {
  'Invalid login credentials': 'INVALID_LOGIN_CREDENTIALS',
  'Email not confirmed': 'EMAIL_NOT_CONFIRMED',
  'Cannot coerce the result to a single JSON object': 'NOT_FOUND',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  500: 'SERVER_ERROR',
};

/**
 * Retorna a chave de tradução adequada para o erro do Supabase ou de rede,
 * priorizando mensagens específicas de erro de negócio.
 */
export function getSupabaseErrorKey(status: number, errorMessage: string = ''): string {
  const errorKey = SUPABASE_ERROR_MAP[errorMessage] || SUPABASE_ERROR_MAP[status] || 'DEFAULT_ERROR';
  return `SUPABASE_ERRORS.${errorKey}`;
}
