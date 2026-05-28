import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'base-theme';
  private isBrowser = typeof window !== 'undefined';
  
  theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    if (this.isBrowser) {
      effect(() => {
        const currentTheme = this.theme();
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem(this.THEME_KEY, currentTheme);
      });
    }
  }

  private getInitialTheme(): Theme {
    if (!this.isBrowser) return 'dark';
    return (localStorage.getItem(this.THEME_KEY) as Theme) || 'dark';
  }

  toggleTheme() {
    this.theme.update(current => (current === 'light' ? 'dark' : 'light'));
  }
}
