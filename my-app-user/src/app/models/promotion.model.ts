export interface Promotion {
    _id: string;
    promotion_code: string;
    promotion_status: string;
    start_date: string;
    end_date: string;
    min_order_value: number;
    discount_percent: number;
    promotion_title: string;
  }
  