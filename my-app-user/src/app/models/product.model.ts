export interface Product {
    name: any;
    _id: string;
    product_name: string;
    description: string;
    price: string | { $numberDecimal: string };
    stock: number;
    material: string;
    gender: string[]; 
    face_shape: string[]; 
    glasses_shape: string; 
    category: string;
    product_image: string;
    total_sold: number;
    colour: string;
    average_rating: number;
    review_count: number;
    created_at: Date;
    updated_at: Date;
    isWishlisted?: boolean; // Biến boolean để đánh dấu wishlist, xử lý riêng biệt
    numericPrice?: number; // Giá trị số để sắp xếp giá khi cần
    formattedPrice?: string;
  }
  