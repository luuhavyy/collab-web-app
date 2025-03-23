export interface Review {
    _id: string;
    customer_id: string;
    product_id: string;
    rating: number;
    comment: string;
    created_at: Date;
    updated_at: Date;
    customer?: { // Thêm trường customer để lưu thông tin khách hàng
      _id: string;
      first_name: string;
      avatar: string;
    };
  }