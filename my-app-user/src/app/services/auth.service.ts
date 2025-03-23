import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { RegisterRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest, LoginResponse, ChangePasswordRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/authCustomer';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken()); // Khởi tạo trạng thái đăng nhập
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  updateLoginStatus(): void {
    this.isLoggedInSubject.next(this.hasToken());
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        console.log('Login API Response:', response); // Kiểm tra response từ API
        if (response.token) {  
          localStorage.setItem('accessToken', response.token);
          localStorage.setItem('customer_id', response.customerId);
  
          this.updateLoginStatus();
          console.log('Token saved:', localStorage.getItem('accessToken'));
        } else {
          console.error('Login failed: No token received');
        }
      })
    );
  }  

  get isLoggedInSync(): boolean {
    return this.isLoggedInSubject.getValue(); // Trả về giá trị hiện tại của BehaviorSubject
  }

  getUserId(): string | null {
    return localStorage.getItem('customer_id');
  }
  
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  changePassword(request: ChangePasswordRequest): Observable<any> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return throwError(() => new Error('Bạn chưa đăng nhập!'));
    }
  
    return this.http.post('/authCustomer/change-password', request, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,  //  Gửi token
        'Content-Type': 'application/json'
      })
    });
  }  
  
  logout(): void {
    localStorage.clear();
    this.updateLoginStatus(); // Đảm bảo trạng thái được cập nhật sau khi đăng xuất
  }
}
