import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { signal } from '@angular/core';

describe('DashboardComponent', () => {
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      currentUser: signal({
        id: '123',
        email: 'user@example.com',
        full_name: 'Test User',
        avatar_url: ''
      }),
      logout: () => {}
    };

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        TranslocoTestingModule.forRoot({
          langs: { pt: {} },
          translocoConfig: {
            defaultLang: 'pt',
            availableLangs: ['pt']
          }
        })
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  it('should create the dashboard component', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
