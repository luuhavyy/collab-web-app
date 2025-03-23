import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgotpassword',
  standalone: false,
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})

export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isSubmitting = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submitForgotPassword() {
    if (this.forgotPasswordForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const requestData = {
      email: this.forgotPasswordForm.value.email  // Đảm bảo email khớp với database, nếu 0 có trong database, trả về lỗi Email 0 tồn tại
    };

    this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
      next: () => {
        alert('Vui lòng kiểm tra email để lấy mã xác nhận!');
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Có lỗi xảy ra, vui lòng thử lại!';
        this.isSubmitting = false;
      }
    });
  }
}