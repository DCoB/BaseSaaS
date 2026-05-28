import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { InjectSupabase } from '../../../shared/functions/inject-supabase.function';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, TranslocoModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly supabase = InjectSupabase();

  resetForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = signal(false);

  async onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    const { password } = this.resetForm.value;

    const { error } = await this.supabase.auth.updateUser({ password });

    if (error) {
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(false);
    this.router.navigate(['/dashboard']);
  }
}
