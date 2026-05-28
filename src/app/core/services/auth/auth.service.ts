import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../../interfaces/user.interface';
import { InjectSupabase } from '../../../shared/functions/inject-supabase.function';
import { NavigationService } from '../navigation.service';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly supabase = InjectSupabase();
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private readonly translocoService = inject(TranslocoService);

  currentUser = signal<IUser | null>(null);
  isLogged = signal<boolean>(false);
  private readonly profileLoaded = signal<IUser | null>(null);
  private profileLoadingPromise: Promise<void> | null = null;

  constructor() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const user = this.mapSupabaseUserToIUser(session.user);
        this.currentUser.set(user);
        this.isLogged.set(true);

        if (this.profileLoaded()?.id !== user.id) {
          this.loadUserProfile(user.id);
        }
      } else {
        this.currentUser.set(null);
        this.isLogged.set(false);
        this.profileLoaded.set(null);
      }
    });
  }

  async load() {
    const { data } = await this.supabase.auth.getSession();

    if (!data.session) {
      this.currentUser.set(null);
      this.isLogged.set(false);
      return;
    }

    const user = this.mapSupabaseUserToIUser(data.session.user);
    this.currentUser.set(user);
    this.isLogged.set(true);

    if (this.profileLoaded()?.id !== user.id) {
      this.loadUserProfile(user.id);
    }
  }

  private mapSupabaseUserToIUser(user: any): IUser {
    const metadata = user.user_metadata || {};
    const identityData = user.identities?.[0]?.identity_data || {};
    const profile = this.profileLoaded();

    return {
      id: user.id,
      email: user.email || '',
      full_name: profile?.full_name || metadata['name'] || metadata['full_name'] || identityData['name'] || '',
      avatar_url: profile?.avatar_url || metadata['avatar_url'] || identityData['avatar_url'] || '',
    };
  }

  /**
   * Carrega dados adicionais de perfil do usuário.
   * Modifique esta função para carregar dados de uma tabela 'profiles' no seu banco de dados Supabase.
   */
  private async loadUserProfile(userId: string): Promise<void> {
    if (this.profileLoadingPromise) {
      return this.profileLoadingPromise;
    }

    if (this.profileLoaded()?.id === userId) {
      return Promise.resolve();
    }

    this.profileLoadingPromise = (async () => {
      this.navigationService.isAppLoading.set(true);

      try {
        // [Customizável] Busque dados adicionais do usuário aqui (Ex: this.supabase.from('profiles')...)
        // Simulando resposta do servidor
        const mockProfile: IUser = {
          id: userId,
          email: this.currentUser()?.email || '',
          full_name: this.currentUser()?.full_name || '',
          avatar_url: this.currentUser()?.avatar_url || ''
        };

        this.profileLoaded.set(mockProfile);
        this.currentUser.update((u) => (u && u.id === userId ? this.mapSupabaseUserToIUser(mockProfile) : u));
      } catch (error) {
        console.error('Erro ao carregar perfil do usuário:', error);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.navigationService.isAppLoading.set(false);
        this.profileLoadingPromise = null;
      }
    })();

    return this.profileLoadingPromise;
  }

  async purgeAndRedirect() {
    await this.supabase.auth.signOut();
    this.router.navigate(['/unauthorized']);
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.router.navigate(['/login']);
  }

  async signInWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      throw error;
    }
  }

  updateProfileSignal(updates: Partial<IUser>) {
    this.profileLoaded.update((p) => (p ? { ...p, ...updates } : p));
    this.currentUser.update((u) => (u ? { ...u, ...updates } : u));
  }
}
