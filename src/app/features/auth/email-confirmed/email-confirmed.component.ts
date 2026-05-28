import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-email-confirmed',
  imports: [RouterLink, TranslocoModule],
  templateUrl: './email-confirmed.component.html',
  styleUrl: './email-confirmed.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfirmedComponent {}
