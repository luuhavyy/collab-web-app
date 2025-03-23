import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { Product } from 'src/app/models/product.model';
import { WishlistItem } from 'src/app/models/wishlist.model';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/models/cart.model';

@Component({
  selector: 'app-wishlist',
  standalone: false,
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: Product[] = [];
  rawWishlist: Set<string> = new Set();  // Lưu id
  showConfirmPopup = false;
  itemToRemove: Product | null = null;

  constructor(
    private router: Router,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe((wishlist: any[] = []) => {
      let productIds: string[] = [];

      if (wishlist.length === 0) {
        this.wishlist = [];
        return;
      }

      if (typeof wishlist[0] === 'string') {
        // Guest mode: string[]
        productIds = wishlist as string[];
      } else {
        // Logged-in mode: WishlistItem[]
        productIds = (wishlist as WishlistItem[]).map(item => item.product_id);
      }

      const productObservables = productIds.map(id =>
        this.productService.getProductById(id)
      );

      // Wait for all product requests to finish
      Promise.all(productObservables.map(o => o.toPromise()))
        .then((products) => {
          this.wishlist = products
            .filter((p): p is Product => p !== undefined)
            .map(p => ({
              ...p,
            }));
        })
        .catch(err => {
          console.error('Lỗi khi tải sản phẩm yêu thích:', err);
        });
    });
  }

  fetchWishlistProducts(ids: string[]) {
    const requests = ids.map(id => this.productService.getProductById(id));

    Promise.all(requests.map(obs => obs.toPromise()))
    .then((products: (Product | undefined)[]) => {
      this.wishlist = products.filter((p): p is Product => p !== undefined);
    })
    
      .catch(err => {
        console.error('Lỗi khi tải sản phẩm wishlist:', err);
      });
  }

  openConfirmPopup(item: Product) {
    this.itemToRemove = item;
    this.showConfirmPopup = true;
  }

  confirmRemove() {
    if (!this.itemToRemove) return;

    const productId = this.itemToRemove._id;
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter(p => p._id !== productId);
        this.rawWishlist.delete(productId);
        this.showConfirmPopup = false;
        this.itemToRemove = null;
      },
      error: (err) => {
        console.error('Không thể xóa sản phẩm khỏi wishlist:', err);
        this.showConfirmPopup = false;
      }
    });
  }

  cancelRemove() {
    this.itemToRemove = null;
    this.showConfirmPopup = false;
  }
  addToCart(product: Product) {
    if (!product) return;
  
    const cartItem: CartItem = {
      product_id: product._id,
      quantity: 1, // Mặc định thêm 1 sản phẩm vào giỏ hàng
      item_price: this.convertPrice(product.price),
    };
  
    this.cartService.addToCart(cartItem).subscribe({
      next: () => {
        alert(`Đã thêm ${product.product_name} vào giỏ hàng!`);
      },
      error: (error) => {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
      },
    });
  }
  
  convertPrice(price: any): number {
    return this.productService.convertPriceToNumber(price);
  }
}
