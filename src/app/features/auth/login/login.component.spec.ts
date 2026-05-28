import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TranslocoTestingModule } from '@jsverse/transloco';

describe('LoginComponent', () => {
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      signInWithGoogle: async () => {},
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        TranslocoTestingModule.forRoot({
          langs: { pt: {} },
          translocoConfig: {
            defaultLang: 'pt',
            availableLangs: ['pt'],
          },
        }),
      ],
      providers: [
        FormBuilder,
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();
  });

  it('should create the login component', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
