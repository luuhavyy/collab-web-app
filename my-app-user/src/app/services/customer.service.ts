import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer, AddressUpdateRequest } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  private apiUrl = '/customer';

  constructor(private http: HttpClient) {}

  /** Helper to get auth headers */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /** Get customer ID from token */
  private getCustomerId(): string | null {
    return localStorage.getItem('customer_id'); // Lấy từ localStorage, có thể thay bằng decode JWT nếu cần
  }

  /** Get customer profile */
  getCustomerById(customerId: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${customerId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /** Update general customer information */
  updateCustomer(customerId: string, customerData: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${customerId}`, customerData, {
      headers: this.getAuthHeaders()
    });
  }
  
  /** Add a new address */
  addCustomerAddress(newAddress: AddressUpdateRequest): Observable<Customer> {
    const customerId = this.getCustomerId();
    if (!customerId) throw new Error('Customer ID is missing!');
    
    return this.http.put<Customer>(`${this.apiUrl}/${customerId}`, {
      address_update: {
        action: 'add',
        new_address: newAddress
      }
    }, { headers: this.getAuthHeaders() });
  }

  /** Update an existing address */
  updateCustomerAddress(id: string, index: number, updatedAddress: AddressUpdateRequest): Observable<Customer> {
    const customerId = this.getCustomerId();
    if (!customerId) throw new Error('Customer ID is missing!');

    return this.http.put<Customer>(`${this.apiUrl}/${customerId}`, {
      address_update: {
        action: 'update',
        index,
        new_address: updatedAddress
      }
    }, { headers: this.getAuthHeaders() });
  }

  /** Delete an address */
  deleteCustomerAddress(index: number): Observable<Customer> {
    const customerId = this.getCustomerId();
    if (!customerId) throw new Error('Customer ID is missing!');

    return this.http.put<Customer>(`${this.apiUrl}/${customerId}`, {
      address_update: {
        action: 'delete',
        index
      }
    }, { headers: this.getAuthHeaders() });
  }
}
