import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  showPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  login() {
    if (this.loginForm.invalid) return;
    this.isSubmitting = true;
    this.errorMessage = null;

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response: LoginResponse) => {
        console.log('Login successful', response);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.errorMessage = err.error.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  redirectToOAuth(provider: string) {
    window.location.href = `https://backend-api.com/oauth/${provider}`;
  }
}
