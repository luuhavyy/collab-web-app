import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { CartItem } from 'src/app/models/cart.model';
import { WishlistItem } from 'src/app/models/wishlist.model';

@Component({
  selector: 'app-product-info',
  standalone: false,
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class ProductInfoComponent implements OnInit {
  product!: Product;
  quantity: number = 1;
  errorMessage: string = '';
  wishlist: Set<string> = new Set<string>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.fetchProductDetails(productId);
      this.loadWishlist();
    } else {
      this.errorMessage = 'Không tìm thấy sản phẩm!';
    }
  }

  fetchProductDetails(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product: Product) => {
        this.product = { ...product };
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải thông tin sản phẩm!';
        console.error(err);
      }
    });
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.product) return;

    const cartItem: CartItem = {
      product_id: this.product._id,
      quantity: this.quantity,
      item_price: this.convertPrice(this.product.price)
    };

    this.cartService.addToCart(cartItem).subscribe(() => {
      alert(`Đã thêm ${this.product.product_name} vào giỏ hàng!`);
    }, (error) => {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
    });
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe((wishlist: any[] = []) => {
      this.wishlist = new Set(
        wishlist.map((item: any) => (typeof item === 'string' ? item : item.product_id))
      );
    });
  }

  toggleWishlist() {
    if (!this.product) return;
    const isWishlisted = this.wishlist.has(this.product._id);

    const action$ = isWishlisted
      ? this.wishlistService.removeFromWishlist(this.product._id)
      : this.wishlistService.addToWishlist(this.product._id);

    action$.subscribe(() => {
      isWishlisted ? this.wishlist.delete(this.product._id) : this.wishlist.add(this.product._id);
    });
  }

  isWishlisted(): boolean {
    return this.product ? this.wishlist.has(this.product._id) : false;
  }

  convertPrice(price: any): number {
    return this.productService.convertPriceToNumber(price);
  }
}
