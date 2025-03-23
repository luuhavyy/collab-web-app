import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = '/review'; 

  constructor(private http: HttpClient) {}

  getReviewsByProductId(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/product/${productId}`);
  }

  createReview(productId: string, rating: number, comment: string): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/product/${productId}`, { rating, comment });
  }
  
}
