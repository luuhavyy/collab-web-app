import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Promotion } from '../models/promotion.model';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private apiUrl = '/promotion';

  constructor(private http: HttpClient) {}

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.apiUrl).pipe(
      map(promotions =>
        promotions.map(promotion => ({
          ...promotion,
          discount_percent: Number((promotion.discount_percent as any)?.$numberDecimal ?? promotion.discount_percent)
        }))
      )
    );
  }

  getPromotionById(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.apiUrl}/${id}`).pipe(
      map(promotion => ({
        ...promotion,
        discount_percent: Number((promotion.discount_percent as any)?.$numberDecimal ?? promotion.discount_percent)
      }))
    );
  }
  getPromotionByCode(promotionCode: string): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.apiUrl}/code/${promotionCode}`).pipe(
      map(promotion => ({
        ...promotion,
        discount_percent: Number((promotion.discount_percent as any)?.$numberDecimal ?? promotion.discount_percent)
      }))
    );
  }
}
