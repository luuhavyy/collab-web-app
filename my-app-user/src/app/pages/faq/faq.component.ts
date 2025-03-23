import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: false,
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})

export class FAQComponent {
  activeIndex: number | null = null;


  faqs = [
    { question: 'Thời gian giao hàng mất bao lâu?', answer: 'Nội thành TP.HCM: 1-2 ngày. Các tỉnh khác: 2-7 ngày. Lưu ý: Nếu quá 7 ngày chưa nhận được hàng, hãy liên hệ ngay hotline: 0377 567 567 để được hỗ trợ.' },
    { question: 'Tôi có thể kiểm tra hàng trước khi thanh toán không?', answer: 'Có, bạn có thể kiểm tra hàng trước khi thanh toán. Tuy nhiên không được đeo thử sản phẩm trước khi mua.' },
    { question: 'Tôi có thể chọn đơn vị vận chuyển không?', answer: 'Hiện tại chúng tôi hỗ trợ GHN, J&T, Viettel Post. Lưu ý Collab Eyewear chưa hỗ trợ chọn đơn vị vận chuyển theo yêu cầu.' },
    { question: 'Tôi có thể thanh toán bằng cách nào?', answer: 'Bạn có thể thanh toán bằng COD (Thanh toán khi nhận hàng), chuyển khoản, hoặc VISA.' },
    { question: 'Tôi muốn chuyển khoản, thông tin tài khoản là gì?', answer: 'Ngân hàng Vietcombank, Tên tài khoản: COLLAB EYEWEAR, STK: 0051963798513.' },
    { question: 'Có ưu đãi phí vận chuyển không?', answer: 'Đơn hàng trên 500.000 VNĐ sẽ được miễn phí vận chuyển.' },
    { question: 'Thông tin cá nhân của tôi có được bảo mật không?', answer: 'Chúng tôi cam kết bảo mật thông tin khách hàng.' }
  ];

  toggleFAQ(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}