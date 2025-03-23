import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { CartService } from 'src/app/services/cart.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-featured-products',
  standalone: false,
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.css']
})
export class FeaturedProductsComponent implements OnInit {
  wishlist: Set<string> = new Set();
  cart: Product[] = [];
  featuredProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Load the top-selling products from the backend
    this.loadFeaturedProducts();

    // Load the wishlist from the service
    this.loadWishlist();
  }

  // Load the top-selling products from the backend
  loadFeaturedProducts() {
    this.productService.getTopSellingProducts().subscribe({
      next: (products: Product[]) => {
        this.featuredProducts = products.map(product => ({
          ...product,
          isWishlisted: this.wishlist.has(product._id) // Check if the product is already in the wishlist
        }));
      },
      error: (err) => {
        console.error('Error loading top selling products:', err);
      }
    });
  }

  // Load the wishlist from the wishlist service
  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (wishlist: any[]) => {
        this.wishlist = new Set(wishlist.map(item => item.product_id));
        this.loadFeaturedProducts(); // Reload featured products with updated wishlist
      },
      error: (err) => {
        console.error('Error loading wishlist:', err);
      }
    });
  }

  // Navigate to the product details page
  goToProductDetail(productId: string) {
    window.location.href = `/product/${productId}`;
  }

  // Navigate to the product list page
  goToProductList() {
    window.location.href = `/product`;
  }
  
  convertPrice(price: any): number {
    return this.productService.convertPriceToNumber(price);
  }
  // Add product to the cart
  addToCart(product: Product) {
    this.cartService.addToCart({ product_id: product._id, quantity: 1, item_price: this.convertPriceToNumber(product.price) }).subscribe({
      next: () => {
        alert(`Added ${product.product_name} to cart.`);
        this.cart.push(product);
      },
      error: (err) => {
        console.error('Error adding product to cart:', err);
      }
    });
  }

  // Toggle product in/out of the wishlist
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
          console.log(`Removed ${product.product_name} from wishlist.`);
        } else {
          this.wishlist.add(product._id);
          product.isWishlisted = true;
          console.log(`Added ${product.product_name} to wishlist.`);
        }
      },
      error: (err) => {
        console.error('Error updating wishlist:', err);
      }
    });
  }

  // Convert price object to a number for rendering
  convertPriceToNumber(price: any): number {
    if (typeof price === 'object' && price.$numberDecimal) {
      price = price.$numberDecimal;
    }
    return parseFloat(price.toString().replace(/\./g, '').replace(',', '.'));
  }
}
