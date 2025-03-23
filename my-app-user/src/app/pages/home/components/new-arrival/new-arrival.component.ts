import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { CartService } from 'src/app/services/cart.service';
import { Product } from 'src/app/models/product.model';
import { WishlistItem } from 'src/app/models/wishlist.model';
import { CartItem } from 'src/app/models/cart.model';

@Component({
  selector: 'app-new-arrival',
  standalone: false,
  templateUrl: './new-arrival.component.html',
  styleUrls: ['./new-arrival.component.css']
})
export class NewArrivalComponent implements OnInit {
  newArrivals: Product[] = [];
  wishlist: Set<string> = new Set();

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (wishlist: any[] = []) => {
        this.wishlist = new Set(
          wishlist.map((item: any) => (typeof item === 'string' ? item : item.product_id))
        );
        this.fetchNewArrivals();
      },
      error: (err) => {
        console.error('Lỗi khi tải wishlist:', err);
        this.fetchNewArrivals();
      }
    });
  }

  fetchNewArrivals() {
    this.productService.getLatestProducts().subscribe({
      next: (products: Product[]) => {
        this.newArrivals = products.map((p) => ({
          ...p,
          isWishlisted: this.wishlist.has(p._id) // Ensure each product has isWishlisted property
        }));
      },
      error: (err) => {
        console.error('Lỗi khi tải sản phẩm mới:', err);
      }
    });
  }

  toggleWishlist(product: Product) {
    const isWishlisted = this.wishlist.has(product._id);

    const action$ = isWishlisted
      ? this.wishlistService.removeFromWishlist(product._id)
      : this.wishlistService.addToWishlist(product._id);

    action$.subscribe({
      next: () => {
        if (isWishlisted) {
          this.wishlist.delete(product._id);
          product.isWishlisted = false;
        } else {
          this.wishlist.add(product._id);
          product.isWishlisted = true;
        }
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật wishlist:', err);
      }
    });
  }

  goToProductDetail(productId: string) {
    window.location.href = `/product/${productId}`;
  }

  goToProductList() {
    window.location.href = `/product`;
  }

  addToCart(product: Product) {
    if (!product) return;

    const cartItem: CartItem = {
      product_id: product._id,
      quantity: 1,
      item_price: this.convertPrice(product.price)
    };

    this.cartService.addToCart(cartItem).subscribe(() => {
      alert(`Đã thêm vào giỏ hàng!`);
    }, (error) => {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
    });
  }

  convertPrice(price: any): number {
    return this.productService.convertPriceToNumber(price);
  }
}
