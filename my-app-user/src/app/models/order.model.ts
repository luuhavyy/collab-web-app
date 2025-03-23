export interface Order {
    _id?: string;
    order_date: string;
    total_price: number;
    total_discount: number;
    total_amount: number;
    order_status: string;
    delivery_address: string;
    customer_id?: string | null; 
    items: OrderItem[]; // Reference to OrderItem array
    payment_method: string;
  }
  export interface OrderItem {
    product_id: string;
    quantity: number;
    item_price: number;
    name?: string;
    image?: string;
  }
  