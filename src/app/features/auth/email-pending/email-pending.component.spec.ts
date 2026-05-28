import { TestBed } from '@angular/core/testing';
import { EmailPendingComponent } from './email-pending.component';
import { ActivatedRoute } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';

describe('EmailPendingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EmailPendingComponent,
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

  it('should create the email pending component', () => {
    const fixture = TestBed.createComponent(EmailPendingComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
