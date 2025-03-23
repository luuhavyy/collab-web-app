import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpasswordafter',
  standalone: false,
  templateUrl: './forgotpasswordafter.component.html',
  styleUrl: './forgotpasswordafter.component.css'
})

export class ForgotPasswordAfterComponent {
  forgotPasswordAfterForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  showCode = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.forgotPasswordAfterForm = this.fb.group({
      username: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      rememberMe: [false]
    });
  }

  toggleCodeVisibility() {
    this.showCode = !this.showCode;
  }

  verifyCode() {
    if (this.forgotPasswordAfterForm.invalid) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    const requestData = {
      email: this.forgotPasswordAfterForm.value.email,
      reset_code: this.forgotPasswordAfterForm.value.code // Check tên đúng với API backend chưa
    };

    // Giả lập gọi API kiểm tra mã OTP
    setTimeout(() => {
      const enteredCode = this.forgotPasswordAfterForm.value.code;
      if (enteredCode === '123456') {
        // Mã OTP đúng, chuyển hướng trang đặt mật khẩu mới
        this.router.navigate(['/resetpassword']);
      } else {
        this.errorMessage = 'Mã code không chính xác!';
      }
      this.isSubmitting = false;
    }, 2000);
  }
}
