import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-email-pending',
  imports: [RouterLink, TranslocoModule],
  templateUrl: './email-pending.component.html',
  styleUrl: './email-pending.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailPendingComponent {}
