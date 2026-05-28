import { TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { FormBuilder } from '@angular/forms';
import { TranslocoTestingModule } from '@jsverse/transloco';

describe('ResetPasswordComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ResetPasswordComponent,
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
      ],
    }).compileComponents();
  });

  it('should create the reset password component', () => {
    const fixture = TestBed.createComponent(ResetPasswordComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
