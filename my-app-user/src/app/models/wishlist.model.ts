export interface WishlistItem {
    product_id: string;
  }
  
  export interface Wishlist {
    _id?: string;
    customer_id: string;
    wishlist_items: WishlistItem[];
  }
  