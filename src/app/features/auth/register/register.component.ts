import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { InjectSupabase } from '../../../shared/functions/inject-supabase.function';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, TranslocoModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly supabase = InjectSupabase();

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = signal(false);

  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    const { email, password, name } = this.registerForm.value;

    const { error, data } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${window.location.origin}/email-confirmed`,
      },
    });

    if (error) {
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(false);

    // Se o Supabase exigir confirmação por e-mail e a sessão ainda não estiver ativa:
    if (data.user && !data.session) {
      this.router.navigate(['/email-pending']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
