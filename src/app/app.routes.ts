import { Routes } from '@angular/router';
import { isLoggedGuard } from './core/guards/is-logged.guard';
import { isGuestGuard } from './core/guards/is-guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [isLoggedGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [isGuestGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [isGuestGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
    canActivate: [isGuestGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/auth/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'email-pending',
    loadComponent: () => import('./features/auth/email-pending/email-pending.component').then((m) => m.EmailPendingComponent),
  },
  {
    path: 'email-confirmed',
    loadComponent: () => import('./features/auth/email-confirmed/email-confirmed.component').then((m) => m.EmailConfirmedComponent),
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/auth/unauthorized/unauthorized.component').then((m) => m.UnauthorizedComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];
