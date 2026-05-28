import { TestBed } from '@angular/core/testing';
import { UnauthorizedComponent } from './unauthorized.component';
import { ActivatedRoute } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';

describe('UnauthorizedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UnauthorizedComponent,
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

  it('should create the unauthorized component', () => {
    const fixture = TestBed.createComponent(UnauthorizedComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
