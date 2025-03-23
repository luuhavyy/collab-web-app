import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressUpdateRequest, Customer, AddressModel } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-address',
  standalone: false,
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  addresses: AddressModel[] = [];
  customer: Customer | null = null;
  errorMessage: string | undefined;
  editIndex: number | null = null;
  editedAddress: AddressModel = new AddressModel();
  deleteIndex: number | null = null;
  showAddForm = false;
  newAddress: AddressModel = new AddressModel();

  constructor(private router: Router, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) {
      this.errorMessage = 'Bạn chưa đăng nhập!';
      return;
    }

    this.customerService.getCustomerById(customerId).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        this.customer = response.customer;
        this.addresses = Array.isArray(response.customer.address_array) ? response.customer.address_array : [];
      },
      error: (err: { error: { message: string; }; }) => {
        this.errorMessage = err.error?.message || 'Không thể tải thông tin khách hàng!';
      }
    });
  }

  /** Chỉnh sửa địa chỉ */
  editAddress(index: number): void {
    this.editIndex = index;
    this.editedAddress = { ...this.addresses[index] };
  }

  /** Lưu địa chỉ đã chỉnh sửa */
  saveAddress(): void {
    if (this.editIndex === null || !this.customer) return;

    const updateRequest: AddressUpdateRequest = {
      action: 'update',
      new_address: this.editedAddress // Đúng format, không bị lồng dữ liệu
    };

    this.customerService.updateCustomerAddress(this.customer.id, this.editIndex, updateRequest).subscribe({
      next: () => {
        this.addresses[this.editIndex!] = { ...this.editedAddress };
        this.editIndex = null;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Không thể cập nhật địa chỉ!';
      }
    });
  }

  /** Hủy chỉnh sửa */
  cancelEdit(): void {
    this.editIndex = null;
  }

  /** Xác nhận xóa địa chỉ */
  confirmDelete(index: number): void {
    this.deleteIndex = index;
  }

  /** Xóa địa chỉ */
  deleteAddress(): void {
    if (this.deleteIndex === null || !this.customer) return;

    const deleteRequest: AddressUpdateRequest = { action: 'delete' };

    this.customerService.updateCustomerAddress(this.customer.id, this.deleteIndex, deleteRequest).subscribe({
      next: () => {
        this.addresses.splice(this.deleteIndex!, 1);
        this.deleteIndex = null;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Không thể xóa địa chỉ!';
      }
    });
  }

  /** Hủy xóa địa chỉ */
  cancelDelete(): void {
    this.deleteIndex = null;
  }

  /** Toggle form thêm địa chỉ */
  toggleAddAddress(): void {
    this.showAddForm = !this.showAddForm;
  }

  /** Thêm địa chỉ mới */
  addNewAddress(): void {
    if (!this.customer) return;

    const addRequest: AddressUpdateRequest = {
      action: 'add',
      new_address: this.newAddress // Đúng format, không bị lồng
    };

    this.customerService.updateCustomerAddress(this.customer.id, this.addresses.length, addRequest).subscribe({
      next: () => {
        this.addresses.push({ ...this.newAddress });
        this.newAddress = new AddressModel();
        this.showAddForm = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Không thể thêm địa chỉ!';
      }
    });
  }

  /** Điều hướng */
  navigateTo(page: string): void {
    this.router.navigate([`/account/${page}`]);
  }

  /** Đăng xuất */
  logout(): void {
    localStorage.removeItem('customer_id');
    this.router.navigate(['/login']);
  }
}
