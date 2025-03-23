import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../services/product.service';
import { Customer } from 'src/app/models/customer.model';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { AuthService } from 'src/app/services/auth.service';
import { PromotionService } from 'src/app/services/promotion.service';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  cartItems: CartItem[] = [];
  customer: Customer = {} as Customer;
  paymentMethod: string = 'cod';
  useAnotherAddress: boolean = false;
  visaCard = { number: '', expiry: '', cvv: '' };
  discountCode: string = '';
  discountCodeApplied: string | null = null;
  discountAmount: number = 0;
  selectedShipping: number = 0;
  totalAmount: number = 0;
  totalCost: number = 0;
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private cartService: CartService,
    private productService: ProductService,
    private promotionService: PromotionService,
    private authService: AuthService,
    private orderService: OrderService,

  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedInSync;
    this.initializeCustomerData();
    this.initializeCartData();
  }
  
  toggleAddress(): void {
    this.useAnotherAddress = !this.useAnotherAddress;
    console.log('Địa chỉ thay thế:', this.useAnotherAddress);
  }
  initializeCustomerData(): void {
  const customerId = localStorage.getItem('customer_id');

  if (customerId) {
    this.customerService.getCustomerById(customerId).subscribe({
      next: (response: any) => {
        if (response.success && response.customer) {
          this.customer = { ...response.customer }; // Sao chép thông tin từ `response.customer`
        } else {
          this.setEmptyCustomer();
        }

        this.ensureAddressArray();
      },
      error: () => {
        console.warn('Không thể tải dữ liệu khách hàng.');
        this.setEmptyCustomer();
      }
    });
  } else {
    this.setEmptyCustomer();
  }
}

ensureAddressArray(): void {
  if (!this.customer.address_array || this.customer.address_array.length === 0) {
    this.customer.address_array = [
      { first_name: '', last_name: '', phone_number: '', address: '' }
    ];
  }
}

  

  setEmptyCustomer(): void {
    this.customer = {
      first_name: '',
      last_name: '',
      phone_number: '',
      email: '',
      address_array: [{ first_name: '', last_name: '', phone_number: '', address: '' }]
    } as Customer;
  }

  initializeCartData(): void {
    const customerId = localStorage.getItem('customer_id');

    if (customerId) {
      this.cartService.getCart().subscribe({
        next: (cartData: Cart) => {
          this.cartItems = cartData.cart_items || [];
          this.populateProductDetails(this.cartItems);
        },
        error: () => alert('Không thể tải dữ liệu giỏ hàng từ cơ sở dữ liệu!')
      });
    } else {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        const parsedCart = JSON.parse(localCart);
        this.cartItems = parsedCart.cart_items || [];
        this.totalAmount = parsedCart.total_price || 0;
        this.populateProductDetails(this.cartItems);
      } else {
        this.cartItems = [];
      }
    }
  }

  populateProductDetails(cartItems: CartItem[]): void {
    const productPromises = cartItems.map((item) =>
      this.productService
        .getProductById(item.product_id)
        .toPromise()
        .then((product) => {
          item.product_name = product?.product_name || 'Sản phẩm không xác định';
          item.colour = product?.colour || 'Không có';
          item.product_image = product?.product_image || 'assets/default.jpg';
          return item;
        })
        .catch(() => {
          item.product_name = 'Sản phẩm không xác định';
          item.colour = 'Không có';
          item.product_image = 'assets/default.jpg';
          return item;
        })
    );

    Promise.all(productPromises).then((updatedItems) => {
      this.cartItems = updatedItems;
      this.calculateTotalAmount();
    });
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.cartItems.reduce(
      (sum, item) => sum + item.item_price * (item.quantity || 1),
      0
    );
    this.totalCost = this.totalAmount + this.selectedShipping - this.discountAmount;
  }

  applyDiscount(): void {
    if (!this.discountCode) {
      alert('Vui lòng nhập mã giảm giá!');
      return;
    }

    this.promotionService.getPromotionByCode(this.discountCode).subscribe({
      next: (promotion) => {
        if (promotion) {
          this.discountCodeApplied = this.discountCode;
          this.discountAmount = this.totalAmount * promotion.discount_percent;
          this.calculateTotalAmount();
          alert(`Đã áp dụng giảm giá: ${promotion.discount_percent*100}%`);
        } else {
          alert('Mã giảm giá không hợp lệ!');
          this.removeDiscount();
        }
      },
      error: () => {
        alert('Lỗi khi kiểm tra mã giảm giá. Vui lòng thử lại sau.');
        this.removeDiscount();
      }
    });
  }

  removeDiscount(): void {
    this.discountCodeApplied = null;
    this.discountAmount = 0;
    this.calculateTotalAmount();
  }

  isFormValid(): boolean {
    const isAddressValid =
      this.customer.address_array &&
      this.customer.address_array.length > 0 &&
      Boolean(this.customer.address_array[0]?.address);

    const isVisaCardValid =
      this.paymentMethod !== 'VISA' ||
      (Boolean(this.visaCard.number) &&
        Boolean(this.visaCard.expiry) &&
        Boolean(this.visaCard.cvv));

    return (
      Boolean(this.customer.first_name) &&
      Boolean(this.customer.last_name) &&
      Boolean(this.customer.phone_number) &&
      Boolean(this.customer.email) &&
      isAddressValid &&
      isVisaCardValid
    );
  }
  
  goToOrderComplete(): void {
    if (this.isFormValid()) {
      const deliveryAddress =
        this.useAnotherAddress || !this.isLoggedIn
          ? this.customer.address_array[0]?.address || ''
          : this.customer.address_array[0]?.address || '';
  
      const order = {
        order_date: new Date().toISOString(),
        total_price: this.totalAmount,
        total_discount: this.discountAmount,
        total_amount: this.totalCost,
        order_status: 'Chờ xác nhận',
        delivery_address: deliveryAddress,
        customer_id: this.isLoggedIn ? localStorage.getItem('customer_id') || null : null,
        items: this.cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          item_price: item.item_price,
        })),
        payment_method: this.paymentMethod,
      };
  
      // Gửi order tới server qua orderService
      this.orderService.createOrder(order).subscribe({
        next: (response: { message: string; orderId: string }) => {
          // Lưu orderId vào sessionStorage
          sessionStorage.setItem('lastOrderId', response.orderId);
      
          // Xóa giỏ hàng sau khi tạo đơn hàng thành công
          this.cartService.clearCart().subscribe({
            next: () => {
              alert('Đơn hàng đã được tạo thành công và giỏ hàng đã được xóa!');
              this.router.navigate(['/ordercomplete'], { state: { orderId: response.orderId } });
            },
            error: (err) => {
              console.error('Lỗi khi xóa giỏ hàng:', err);
              alert('Đơn hàng đã được tạo nhưng có lỗi xảy ra khi xóa giỏ hàng. Vui lòng kiểm tra lại!');
            },
          });
        },
        error: (error: any) => {
          console.error('Lỗi tạo đơn hàng:', error);
          alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!');
        },
      });
    } else {
      alert('Vui lòng nhập đầy đủ thông tin trước khi tiếp tục!');
    }
  }
  
  updatePaymentMethod(): void {
    console.log('Phương thức thanh toán đã thay đổi:', this.paymentMethod);
  }
  
  goBackToCart(): void {
    this.router.navigate(['/cart']);
  }
}