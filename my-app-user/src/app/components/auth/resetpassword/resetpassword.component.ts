import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-resetpassword',
  standalone: false,
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  isSubmitting = false;
  errorMessage: string = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // ✅ Fixed Email Validation
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*\\d).{8,}$')]],
      confirmPassword: ['']
    }, { validators: this.passwordsMatchValidator });
  }

  // Hàm kiểm tra mật khẩu khớp nhau
  passwordsMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  // Toggle hiển thị mật khẩu
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Hàm gửi yêu cầu đặt lại mật khẩu
  resetPassword() {
    if (this.resetPasswordForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const { email, newPassword } = this.resetPasswordForm.value;

    //  Corrected API call
    this.authService.resetPassword({ email, newPassword }).subscribe({
      next: () => {
        alert('Mật khẩu đã được đặt lại thành công!');
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Có lỗi xảy ra, vui lòng thử lại!';
        this.isSubmitting = false;
      }
    });
  }
}
