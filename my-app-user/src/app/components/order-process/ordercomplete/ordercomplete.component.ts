import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-ordercomplete',
  standalone: false,
  templateUrl: './ordercomplete.component.html',
  styleUrl: './ordercomplete.component.css'
})
export class OrderCompleteComponent implements OnInit {
  cartItems: any[] = [];
  order_id: string = '';
  order_date: string = '';
  total_amount: number = 0;
  payment_method: string = '';

  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    // Lấy ID đơn hàng từ sessionStorage
    const lastOrderId = sessionStorage.getItem('lastOrderId');
    if (!lastOrderId) {
      this.errorMessage = 'Không tìm thấy thông tin đơn hàng.';
      this.isLoading = false;
      return;
    }

    // Gọi API để lấy thông tin đơn hàng
    this.orderService.getOrderById(lastOrderId).subscribe({
      next: (order: Order) => {
        this.order_id = order._id || '';
        this.order_date = new Date(order.order_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        this.total_amount = order.total_amount;
        this.payment_method = order.payment_method;

        // Lấy chi tiết sản phẩm từ productService
        const productDetailRequests = order.items.map((item) =>
          this.productService.getProductById(item.product_id).toPromise().then((product) => {
            if (product) {
              this.cartItems.push({
                product_name: product.name,
                product_image: product.product_image,
                item_price: item.item_price,
                quantity: item.quantity
              });
            } else {
              this.cartItems.push({
                product_name: 'Sản phẩm không tồn tại',
                product_image: 'assets/images/placeholder.png',
                item_price: item.item_price,
                quantity: item.quantity
              });
            }
          })
        );

        // Đợi tất cả chi tiết sản phẩm được lấy
        Promise.all(productDetailRequests)
          .then(() => {
            this.isLoading = false;
          })
          .catch((error) => {
            console.error('Lỗi khi tải thông tin sản phẩm:', error);
            this.errorMessage = 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau!';
            this.isLoading = false;
          });
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        this.errorMessage = 'Không thể tải thông tin đơn hàng. Vui lòng thử lại sau!';
        this.isLoading = false;
      }
    });
  }

  goToHistory() {
    this.router.navigate(['/orderhistory']);
  }
}