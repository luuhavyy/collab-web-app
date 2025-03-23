import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  customer: Customer = {} as Customer;
  errorMessage: string = '';
  safeAvatarUrl: SafeUrl = 'assets/images/user-avatar.jpeg';

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private sanitizer: DomSanitizer,
    private authService: AuthService 
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

          // Nếu avatar là base64, chuyển sang định dạng Data URL hợp lệ
          if (this.customer.avatar) {
            this.safeAvatarUrl = this.sanitizer.bypassSecurityTrustUrl(
              `${this.customer.avatar}`
            );
          } else {
            this.safeAvatarUrl = 'assets/images/user-avatar.jpeg';
          }
        } else {
          this.errorMessage = 'Dữ liệu trả về không hợp lệ!';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Không thể tải thông tin khách hàng!';
      }
    });
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  // Đăng xuất
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Điều hướng về trang đăng nhập
  }
}
