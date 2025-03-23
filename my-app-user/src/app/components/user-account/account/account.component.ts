import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ChangePassword, ChangePasswordRequest } from '../../../models/auth.model';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  customer: Customer = {} as Customer;
  password: ChangePassword = {} as ChangePassword;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  // Lấy thông tin khách hàng từ API
  getUserProfile(): void {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) {
      this.errorMessage = 'Bạn chưa đăng nhập!';
      return;
    }

    this.customerService.getCustomerById(customerId).subscribe({
      next: (response: any) => {
        if (response.success && response.customer) {
          this.customer = { ...response.customer };

          // Nếu avatar là Base64, chuyển thành Data URL
          this.customer.avatar = this.customer.avatar 
            ? `${this.customer.avatar}`
            : 'assets/images/user-avatar.jpeg'; // Ảnh mặc định
        } else {
          this.errorMessage = 'Dữ liệu trả về không hợp lệ!';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Không thể tải thông tin khách hàng!';
      }
    });
  }

  // Cập nhật thông tin người dùng
  updateUserInfo(): void {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) {
      this.errorMessage = 'Bạn chưa đăng nhập!';
      return;
    }

    this.customerService.updateCustomer(customerId, this.customer).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('Cập nhật thông tin thành công!');
          this.getUserProfile(); // Cập nhật lại thông tin sau khi sửa
        } else {
          this.errorMessage = 'Cập nhật không thành công!';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Có lỗi xảy ra khi cập nhật!';
      }
    });
  }

  // Đổi mật khẩu
  changePassword(): void {
    if (this.password.newPassword !== this.password.confirmNewPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp!';
      return;
    }

    const request: ChangePasswordRequest = {
      oldPassword: this.password.oldPassword,
      newPassword: this.password.newPassword
    };

    this.authService.changePassword(request).subscribe({
      next: () => {
        alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
        this.logout();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Không thể đổi mật khẩu!';
      }
    });
  }

  // Đăng xuất
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Điều hướng về trang đăng nhập
  }
}
