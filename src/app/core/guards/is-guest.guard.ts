import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";

/**
 * Guard para rotas de convidados (Login, Cadastro).
 * Redireciona o usuário para o Dashboard caso ele já possua uma sessão de autenticação ativa.
 */
export const isGuestGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLogged()) {
    if (state.url.includes('email-confirmed')) {
      return true;
    }
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
