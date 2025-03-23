import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-orderhistory',
  standalone: false,
  templateUrl: './orderhistory.component.html',
  styleUrl: './orderhistory.component.css'
})

export class OrderHistoryComponent  {

  orders: Order[] = [];
  selectedOrder: Order | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private router: Router, private orderService: OrderService,
    private productService: ProductService 
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  // Lấy danh sách đơn hàng từ OrderService
  fetchOrders(): void {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        const productDetailRequests = orders.flatMap((order) =>
          order.items.map((item) =>
            this.productService.getProductById(item.product_id).toPromise().then((product) => {
              if (product) { // Kiểm tra nếu product không undefined
                item.name = product.product_name;
                item.image = product.product_image;
              } else {
                console.warn(`Không tìm thấy sản phẩm với ID: ${item.product_id}`);
                item.name = 'Sản phẩm không tồn tại';
                item.image = 'assets/images/placeholder.png'; // Hình ảnh thay thế
              }
            })
          )
        );
  
        Promise.all(productDetailRequests)
          .then(() => {
            this.orders = orders;
            this.isLoading = false;
          })
          .catch((error) => {
            console.error('Lỗi khi lấy thông tin sản phẩm:', error);
            this.errorMessage = 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau!';
            this.isLoading = false;
          });
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        this.errorMessage = 'Không thể tải danh sách đơn hàng. Vui lòng thử lại sau!';
        this.isLoading = false;
      },
    });
  }  

  // Hiển thị chi tiết đơn hàng
  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  // Đóng chi tiết đơn hàng
  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

}
