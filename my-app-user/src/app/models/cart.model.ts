export interface CartItem {
    product_id: string;
    quantity: number;
    product_name?: string;
    colour?: string;
    item_price: number;
    product_image?: string;
}

  
  export interface Cart {
    _id?: string;
    customer_id: string;
    total_items: number;
    total_price: number;
    cart_items: CartItem[];
  }
  