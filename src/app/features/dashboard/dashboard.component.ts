// Angular Modules
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// Third-party Libraries
import { TranslocoModule } from '@jsverse/transloco';

// Application Services
import { AuthService } from '../../core/services/auth/auth.service';

// Shared Components
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';

@Component({
  selector: 'app-dashboard',
  imports: [TranslocoModule, TopbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  protected readonly user = this.authService.currentUser;

  logout() {
    this.authService.logout();
  }
}
