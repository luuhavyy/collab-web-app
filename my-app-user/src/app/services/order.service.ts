
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = '/order';

  constructor(private http: HttpClient) {}

  // Lấy danh sách đơn hàng của khách hàng
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl).pipe(
      map(orders =>
        orders.map(order => ({
          ...order,
          total_price: Number((order.total_price as any)?.$numberDecimal ?? order.total_price),
          total_discount: Number((order.total_discount as any)?.$numberDecimal ?? order.total_discount),
          total_amount: Number((order.total_amount as any)?.$numberDecimal ?? order.total_amount),
          items: order.items.map(item => ({
            ...item,
            item_price: Number((item.item_price as any)?.$numberDecimal ?? item.item_price),
          })),
        }))
      )
    );
  }
  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`).pipe(
      map((order) => ({
        ...order,
        total_price: Number((order.total_price as any)?.$numberDecimal ?? order.total_price),
        total_discount: Number((order.total_discount as any)?.$numberDecimal ?? order.total_discount),
        total_amount: Number((order.total_amount as any)?.$numberDecimal ?? order.total_amount),
        items: order.items.map((item) => ({
          ...item,
          item_price: Number((item.item_price as any)?.$numberDecimal ?? item.item_price),
        })),
      }))
    );
  }
  
// Tạo đơn hàng mới
createOrder(order: Order): Observable<{ message: string; orderId: string }> {
  return this.http.post<{ message: string; orderId: string }>(this.apiUrl, {
    ...order,
    total_price: parseFloat(order.total_price.toFixed(2)),
    total_discount: parseFloat(order.total_discount.toFixed(2)),
    total_amount: parseFloat(order.total_amount.toFixed(2)),
    items: order.items.map(item => ({
      ...item,
      item_price: parseFloat(item.item_price.toFixed(2)),
    })),
  });
}
}
