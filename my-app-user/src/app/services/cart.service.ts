import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `/cart`;
  private localKey = 'cart';
  private totalItemsSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0); // Theo dõi tổng số lượng sản phẩm trong giỏ hàng

  constructor(private http: HttpClient, private authService: AuthService) {
    this.initializeCartQuantity();
  }

  // Observable để theo dõi số lượng sản phẩm trong thời gian thực
  get totalItems$(): Observable<number> {
    return this.totalItemsSubject.asObservable();
  }

  // Khởi tạo số lượng sản phẩm ban đầu
  private initializeCartQuantity(): void {
    this.getCartQuantity().subscribe({
      next: (totalItems) => this.totalItemsSubject.next(totalItems),
      error: (err) => console.error('Lỗi khi khởi tạo số lượng giỏ hàng:', err),
    });
  }

  // Lấy tổng số lượng sản phẩm trong giỏ hàng
  getCartQuantity(): Observable<number> {
    if (this.authService.isLoggedInSync) {
      return this.http.get<Cart>(`${this.apiUrl}`).pipe(
        map((cart) => cart.total_items || 0),
        map((totalItems) => {
          this.totalItemsSubject.next(totalItems);
          return totalItems;
        })
      );
    } else {
      const cart = this.getCartFromLocal();
      const totalItems = cart.total_items || 0;
      this.totalItemsSubject.next(totalItems);
      return of(totalItems);
    }
  }

  // Lấy dữ liệu giỏ hàng
  getCart(): Observable<Cart> {
    if (this.authService.isLoggedInSync) {
      return this.http.get<Cart>(`${this.apiUrl}`).pipe(
        map((cart) => {
          cart.cart_items = cart.cart_items.map((item) => ({
            ...item,
            item_price: Number((item.item_price as any)?.$numberDecimal ?? item.item_price),
          }));
          this.totalItemsSubject.next(cart.total_items);
          return cart;
        })
      );
    } else {
      const cart = this.getCartFromLocal();
      cart.cart_items = cart.cart_items.map((item) => ({
        ...item,
        item_price: Number((item.item_price as any)?.$numberDecimal ?? item.item_price),
      }));
      this.totalItemsSubject.next(cart.total_items);
      return of(cart);
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(item: CartItem): Observable<any> {
    if (this.authService.isLoggedInSync) {
      return this.http.post<Cart>(`${this.apiUrl}`, {
        product_id: item.product_id,
        quantity: item.quantity,
      }).pipe(
        map((cart) => {
          this.totalItemsSubject.next(cart.total_items);
          return cart;
        })
      );
    } else {
      this.addToLocalCart(item);
      return of({ message: 'Sản phẩm đã được lưu vào giỏ hàng cục bộ', item });
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(productId: string): Observable<any> {
    if (this.authService.isLoggedInSync) {
      return this.http.delete<Cart>(`${this.apiUrl}/${productId}`).pipe(
        map((cart) => {
          this.totalItemsSubject.next(cart.total_items);
          return cart;
        })
      );
    } else {
      this.removeFromLocalCart(productId);
      return of({ message: 'Sản phẩm đã bị xóa khỏi giỏ hàng cục bộ', product_id: productId });
    }
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartQuantity(productId: string, quantity: number): Observable<any> {
    if (this.authService.isLoggedInSync) {
      return this.http.put<Cart>(`${this.apiUrl}`, {
        product_id: productId,
        quantity,
      }).pipe(
        map((cart) => {
          this.totalItemsSubject.next(cart.total_items);
          return cart;
        })
      );
    } else {
      this.updateLocalCartQuantity(productId, quantity);
      return of({ message: 'Số lượng sản phẩm trong giỏ hàng cục bộ đã được cập nhật', product_id: productId, quantity });
    }
  }

  // Đồng bộ giỏ hàng cục bộ với máy chủ khi đăng nhập
  syncCartOnLogin(): void {
    if (this.authService.isLoggedInSync) {
      const localCart = this.getCartFromLocal();
      if (localCart.cart_items.length > 0) {
        this.http.post(`${this.apiUrl}/sync`, {
          customer_id: this.authService.getUserId(),
          cart_items: localCart.cart_items,
        }).subscribe({
          next: () => this.clearLocalCart(),
          error: (err) => console.error('Lỗi khi đồng bộ giỏ hàng:', err),
        });
      }
    }
  }
  
// Xóa toàn bộ giỏ hàng
clearCart(): Observable<any> {
  if (this.authService.isLoggedInSync) {
    // Nếu đã đăng nhập, gọi API xóa giỏ hàng trên server
    return this.http.delete(`${this.apiUrl}/clear`).pipe(
      map(() => {
        this.totalItemsSubject.next(0); // Cập nhật tổng số lượng sản phẩm về 0
        return { message: 'Giỏ hàng đã được xóa thành công trên máy chủ' };
      })
    );
  } else {
    // Nếu chưa đăng nhập, xóa giỏ hàng cục bộ
    this.clearLocalCart();
    return of({ message: 'Giỏ hàng cục bộ đã được xóa thành công' });
  }
}

  // Giỏ hàng cục bộ

  // Lấy dữ liệu từ Local Storage
  getCartFromLocal(): Cart {
    const data = localStorage.getItem(this.localKey);
    return data ? JSON.parse(data) : { customer_id: '', total_items: 0, total_price: 0, cart_items: [] };
  }

  // Lưu dữ liệu vào Local Storage
  saveCartToLocal(cart: Cart): void {
    localStorage.setItem(this.localKey, JSON.stringify(cart));
    this.totalItemsSubject.next(cart.total_items);
  }

  // Thêm sản phẩm vào giỏ hàng cục bộ
  addToLocalCart(item: CartItem): void {
    const cart = this.getCartFromLocal();
    const existing = cart.cart_items.find((i) => i.product_id === item.product_id);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.cart_items.push(item);
    }

    cart.total_items = cart.cart_items.reduce((sum, i) => sum + i.quantity, 0);
    cart.total_price = cart.cart_items.reduce((sum, i) => sum + i.quantity * i.item_price, 0);

    this.saveCartToLocal(cart);
  }

  // Xóa sản phẩm khỏi giỏ hàng cục bộ
  removeFromLocalCart(productId: string): void {
    const cart = this.getCartFromLocal();
    cart.cart_items = cart.cart_items.filter((i) => i.product_id !== productId);
    cart.total_items = cart.cart_items.reduce((sum, i) => sum + i.quantity, 0);
    cart.total_price = cart.cart_items.reduce((sum, i) => sum + i.quantity * i.item_price, 0);

    this.saveCartToLocal(cart);
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng cục bộ
  updateLocalCartQuantity(productId: string, quantity: number): void {
    const cart = this.getCartFromLocal();
    const item = cart.cart_items.find((i) => i.product_id === productId);

    if (item) {
      item.quantity = quantity;
    }

    cart.total_items = cart.cart_items.reduce((sum, i) => sum + i.quantity, 0);
    cart.total_price = cart.cart_items.reduce((sum, i) => sum + i.quantity * i.item_price, 0);

    this.saveCartToLocal(cart);
  }

  // Xóa giỏ hàng cục bộ
  clearLocalCart(): void {
    localStorage.removeItem(this.localKey);
    this.totalItemsSubject.next(0);
  }
}
