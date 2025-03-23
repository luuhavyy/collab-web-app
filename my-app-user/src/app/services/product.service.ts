import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getReviewsByProductId(id: number): any[] {
    throw new Error('Method not implemented.');
  }
  private apiUrl = '/product'; // Đổi theo URL backend

  constructor(private http: HttpClient) {}
  // Hàm chuyển đổi giá về dạng số
  public convertPriceToNumber(price: any): number {
    if (typeof price === 'object' && price?.$numberDecimal) {
      return parseFloat(price.$numberDecimal);
    }
    return typeof price === 'string' ? parseFloat(price) : price;
  }
  
  // Hàm chuyển đổi chuỗi thành slug (VD: "Kính Mắt" -> "kinh-mat")
  private convertToSlug(text: string): string {
    return text
      .normalize("NFD") // Chuẩn hóa Unicode
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
      .toLowerCase()
      .replace(/[đ]/g, "d") // Chuyển "đ" -> "d"
      .replace(/[^a-z0-9]+/g, "-") // Thay khoảng trắng và ký tự đặc biệt bằng "-"
      .replace(/^-+|-+$/g, ""); // Xóa dấu "-" ở đầu/cuối
  }

  // Lấy tất cả sản phẩm
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/`);
  }

  // Lọc sản phẩm theo danh mục (chuyển category thành slug)
  getProductsByCategory(category: string): Observable<Product[]> {
    const categorySlug = this.convertToSlug(category);
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categorySlug}`);
  }

  // Lọc sản phẩm theo thuộc tính (chuyển filter thành slug trước khi gửi request)
  getProductsByAttributes(filters: { gender?: string; face_shape?: string; material?: string }): Observable<Product[]> {
    let params = new HttpParams();

    if (filters.gender) params = params.append('gender', this.convertToSlug(filters.gender));
    if (filters.face_shape) params = params.append('face_shape', this.convertToSlug(filters.face_shape));
    if (filters.material) params = params.append('material', this.convertToSlug(filters.material));

    return this.http.get<Product[]>(`${this.apiUrl}/filter`, { params });
  }

  // Lấy sản phẩm theo ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Lấy danh mục sản phẩm
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  // Lấy top 5 sản phẩm mới nhất
  getLatestProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/latest`);
  }

  // Lấy top 5 sản phẩm bán chạy nhất (chỉ dành cho admin)
  getTopSellingProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/top-selling`);
  }
}

