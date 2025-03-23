import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchQuery: string = '';
  isSearchActive: boolean = false;
  total_item: number = 0; // Total items in the cart
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService // Inject the CartService
  ) {}

  ngOnInit() {
    // Listen for login status changes
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      console.log('Header updated, isLoggedIn:', this.isLoggedIn);
      this.updateCartQuantity(); // Update the cart quantity whenever login status changes
    });

    // Subscribe to cart total items in real-time
    this.cartService.totalItems$.subscribe((total_items: number) => {
      this.total_item = total_items; // Update total items in real-time
    });

    // Update the cart quantity on initial load
    this.updateCartQuantity();
  }

  updateCartQuantity() {
    // Use getCartQuantity to fetch total items in the cart
    this.cartService.getCartQuantity().subscribe((total_items: number) => {
      this.total_item = total_items; // Update total items
    });
  }

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
  }

  searchProduct() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
    }
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToAccount() {
    console.log('isLoggedInSync:', this.authService.isLoggedInSync);
    if (this.authService.isLoggedInSync) {
      this.router.navigate(['/account']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
