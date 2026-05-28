import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    // Limpar o localStorage antes de cada teste
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve iniciar com o tema padrão dark', () => {
    expect(service.theme()).toBe('dark');
  });

  it('deve alternar o tema com toggleTheme()', () => {
    expect(service.theme()).toBe('dark');
    service.toggleTheme();
    expect(service.theme()).toBe('light');
    service.toggleTheme();
    expect(service.theme()).toBe('dark');
  });

  it('deve salvar a preferência no localStorage ao alternar o tema', () => {
    service.toggleTheme();
    TestBed.flushEffects();
    if (typeof window !== 'undefined') {
      expect(localStorage.getItem('base-theme')).toBe('light');
    }
  });
});
