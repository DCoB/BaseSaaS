import { signal, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTransloco, TranslocoService, TranslocoLoader, Translation } from '@jsverse/transloco';
import { of, Observable } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TopbarComponent } from './topbar.component';

class MockAuthService {
  currentUser = signal({
    email: 'test@example.com',
    full_name: 'Test User',
    avatar_url: null,
  });
  logout = vi.fn();
}

@Injectable()
class MockTranslocoLoader implements TranslocoLoader {
  getTranslation(lang: string): Observable<Translation> {
    return of({});
  }
}

describe('TopbarComponent', () => {
  let translocoService: TranslocoService;
  let authService: MockAuthService;

  beforeEach(async () => {
    authService = new MockAuthService();

    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        provideTransloco({
          config: {
            availableLangs: ['pt', 'en', 'es'],
            defaultLang: 'pt',
          },
          loader: MockTranslocoLoader,
        }),
      ],
    }).compileComponents();

    translocoService = TestBed.inject(TranslocoService);
  });

  it('should create the topbar component', () => {
    const fixture = TestBed.createComponent(TopbarComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should toggle theme when toggleTheme is called', () => {
    const fixture = TestBed.createComponent(TopbarComponent);
    const component = fixture.componentInstance;
    const initialTheme = component['currentTheme']();
    component['toggleTheme']();
    const newTheme = component['currentTheme']();
    expect(newTheme).not.toBe(initialTheme);
  });
});
