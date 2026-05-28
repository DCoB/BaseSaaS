import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";

/**
 * Guard para rotas protegidas que exige que o usuário esteja autenticado.
 * Caso contrário, encerra qualquer sessão local e redireciona para a página não autorizada.
 */
export const isLoggedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  if (!authService.isLogged()) {
    authService.purgeAndRedirect();
    return false;
  }

  return true;
};
