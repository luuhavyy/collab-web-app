import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { CartService } from 'src/app/services/cart.service';
import { Product } from 'src/app/models/product.model';
import { CartItem } from 'src/app/models/cart.model';

@Component({
  selector: 'app-perfect-match-step',
  standalone: false,
  templateUrl: './perfect-match-step.component.html',
  styleUrls: ['./perfect-match-step.component.css']
})
export class PerfectMatchStepComponent implements OnInit {

  currentStep: number = 1;
  progress: number = 0;
  selectedFaceShape: string | null = null;
  selectedGender: string | null = null;
  selectedMaterial: string | null = null;
  recommendedProducts: Product[] = [];
  wishlist: Set<string> = new Set();
  cart: Product[] = [];

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Load wishlist and cart data on component initialization
    this.loadWishlist();
  }

  // Step-specific methods to update selected values
  selectFaceShape(shape: string) {
    this.selectedFaceShape = shape;
  }

  selectGender(gender: string) {
    this.selectedGender = gender;
  }

  selectMaterial(material: string) {
    this.selectedMaterial = material;
  }

  nextStep() {
    if (this.currentStep < 6) {
      this.currentStep++;
      this.updateProgress();
    }

    if (this.currentStep === 5) {
      setTimeout(() => {
        this.currentStep = 6;
        this.updateProgress();
        this.loadRecommendedProducts();
      }, 3000);
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateProgress();
    }
  }

  restart() {
    this.currentStep = 1;
    this.progress = 0;
    this.selectedFaceShape = null;
    this.selectedGender = null;
    this.selectedMaterial = null;
    this.recommendedProducts = [];
  }

  updateProgress() {
    this.progress = ((this.currentStep - 1) / 5) * 100;
  }

  loadRecommendedProducts() {
    const filters = {
      gender: this.selectedGender || undefined,
      face_shape: this.selectedFaceShape || undefined,
      material: this.selectedMaterial || undefined
    };

    this.productService.getProductsByAttributes(filters).subscribe({
      next: (products: Product[]) => {
        this.recommendedProducts = products.map(product => ({
          ...product,
          isWishlisted: this.wishlist.has(product._id)
        }));
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  convertPrice(price: any): number {
    return this.productService.convertPriceToNumber(price);
  }

  // Wishlist methods
  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (wishlist: any[]) => {
        this.wishlist = new Set(wishlist.map(item => item.product_id));
        this.loadRecommendedProducts(); // Reload recommended products with updated wishlist
      },
      error: (err) => {
        console.error('Error loading wishlist:', err);
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
        console.error('Error updating wishlist:', err);
      }
    });
  }

  // Cart methods

  addToCart(product: Product) {
    const cartItem: CartItem = {
      product_id: product._id,
      quantity: 1,
      item_price: 0
    };

    this.cartService.addToCart(cartItem).subscribe({
      next: () => {
        alert('Product added to cart!');
        this.cart.push(product);
      },
      error: (err) => {
        console.error('Error adding product to cart:', err);
      }
    });
  }
}
