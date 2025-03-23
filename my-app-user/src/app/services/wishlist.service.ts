import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { WishlistItem } from '../models/wishlist.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `/wishlist`;
  private localKey = 'wishlist';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // ===============================
  //   LOCAL STORAGE METHODS
  // ===============================

  getWishlistFromLocal(): string[] {
    const data = localStorage.getItem(this.localKey);
    return data ? JSON.parse(data) : [];
  }

  saveWishlistToLocal(productIds: string[]) {
    localStorage.setItem(this.localKey, JSON.stringify(productIds));
  }

  addToLocalWishlist(productId: string) {
    const current = this.getWishlistFromLocal();
    if (!current.includes(productId)) {
      current.push(productId);
      this.saveWishlistToLocal(current);
    }
  }

  removeFromLocalWishlist(productId: string) {
    const updated = this.getWishlistFromLocal().filter(id => id !== productId);
    this.saveWishlistToLocal(updated);
  }

  clearLocalWishlist() {
    localStorage.removeItem(this.localKey);
  }

  // ===============================
  //   API METHODS
  // ===============================

  addToWishlist(productId: string): Observable<any> {
    if (this.authService.isLoggedInSync) {
      return this.http.post(this.apiUrl, { product_id: productId });
    } else {
      this.addToLocalWishlist(productId);
      return of({ message: 'Saved to Local Storage Wishlist', product_id: productId });
    }
  }

  removeFromWishlist(productId: string): Observable<any> {
    if (this.authService.isLoggedInSync) {
      return this.http.delete(`${this.apiUrl}/${productId}`);
    } else {
      this.removeFromLocalWishlist(productId);
      return of({ message: 'Removed from Local Storage Wishlist', product_id: productId });
    }
  }

  getWishlist(): Observable<WishlistItem[] | string[]> {
    if (this.authService.isLoggedInSync) {
      return this.http.get<WishlistItem[]>(this.apiUrl);
    } else {
      const localIds = this.getWishlistFromLocal();
      return of(localIds);
    }
  }

  syncWishlistOnLogin(): void {
    if (this.authService.isLoggedInSync) {
      const localIds = this.getWishlistFromLocal();
      if (localIds.length > 0) {
        this.http.post<{ message: string; wishlist: WishlistItem[] }>(
          `${this.apiUrl}/sync`,
          { wishlist_items: localIds }
        ).subscribe({
          next: () => this.clearLocalWishlist(),
          error: err => console.error('Failed to sync wishlist', err),
        });
      }
    }
  }
}
