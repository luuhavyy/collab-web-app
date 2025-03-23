import { Component } from '@angular/core';

@Component({
  selector: 'app-policy',
  standalone: false,
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.css'
})

export class PolicyComponent {
  policies = [
    { title: 'Chính sách đổi trả', image: 'assets/images/return-policy.png' },
    { title: 'Chính sách giao hàng', image: 'assets/images/shipping-policy.png' },
    { title: 'Chính sách bảo mật', image: 'assets/images/security-policy.png' },
    { title: 'Chính sách thanh toán', image: 'assets/images/payment-policy.png' }
  ];

  loadMore() {
    alert('Tải thêm chính sách...');
  }
}
