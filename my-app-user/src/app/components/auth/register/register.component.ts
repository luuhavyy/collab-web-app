import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      last_name: ['', Validators.required],
      first_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*\\d).+$')]
      ],
      agreeToTerms: [false, Validators.requiredTrue]
    });
  }

  get f() {
    return this.registerForm.controls;
  }  

  register(): void {
    if (this.registerForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const requestData: RegisterRequest = this.registerForm.value;

    this.authService.register(requestData).subscribe({
      next: () => {
        alert('Đăng ký thành công!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Đăng ký thất bại!';
        this.isSubmitting = false;
      }
    });
  }
}
