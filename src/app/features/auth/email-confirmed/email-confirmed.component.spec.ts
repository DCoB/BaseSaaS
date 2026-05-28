import { TestBed } from '@angular/core/testing';
import { EmailConfirmedComponent } from './email-confirmed.component';
import { ActivatedRoute } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';

describe('EmailConfirmedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EmailConfirmedComponent,
        TranslocoTestingModule.forRoot({
          langs: { pt: {} },
          translocoConfig: {
            defaultLang: 'pt',
            availableLangs: ['pt'],
          },
        }),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
  });

  it('should create the email confirmed component', () => {
    const fixture = TestBed.createComponent(EmailConfirmedComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
