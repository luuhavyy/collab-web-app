import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { Cart, CartItem } from '../../../models/cart.model';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  cartItems: any[] = [];
  shippingFee: number = 0;
  selectedShipping: string = 'free';
  selectedItem: CartItem | null = null;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
      this.populateCartItems();
    });
  }

  async populateCartItems() {
    if (!this.cart) return;

    const updatedCartItems = await Promise.all(
      this.cart.cart_items.map(async (cartItem: CartItem) => {
        const product = await this.productService.getProductById(cartItem.product_id).toPromise();
        return {
          ...cartItem,
          item_price: Number(cartItem.item_price), // Ép kiểu số
          product_name: product?.product_name || 'Không có tên',
          product_image: product?.product_image || 'assets/default.jpg',
          colour: product?.colour || 'Không xác định',
        };
      })
    );

    this.cartItems = updatedCartItems;
  }

  get totalAmount(): number {
    return this.cart?.total_price || 0;
  }  

  get totalCost(): number {
    return this.totalAmount + this.shippingFee;
  }

  updateShipping(option: string) {
    this.selectedShipping = option;
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.updateCartItem(item.product_id, item.quantity);
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCartItem(item.product_id, item.quantity);
    }
  }

  updateCartItem(productId: string, quantity: number) {
    this.cartService.updateCartQuantity(productId, quantity).subscribe(() => this.loadCart());
  }

  selectItemToRemove(item: any) {
    this.selectedItem = item;
  }

  removeFromWishlist() {
    if (this.selectedItem) {
      this.cartService.removeFromCart(this.selectedItem.product_id).subscribe(() => {
        this.cartItems = this.cartItems.filter(i => i.product_id !== this.selectedItem!.product_id);
        this.selectedItem = null;
      });
    }
  }

  cancelDelete() {
    this.selectedItem = null;
  }

  goToPayment() {
    this.router.navigate(['/payment']);
  }
}
