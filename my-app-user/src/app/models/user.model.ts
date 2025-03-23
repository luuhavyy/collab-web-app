export interface User {
    first_name: string;
    last_name: string;
    email: string;
    password?: string; // Không cần password khi lấy thông tin user
  }
  
  export interface LoginResponse {
    accessToken: string;
    customer_id: string;
    email: string;
    buying_points: number;
  }
  
  export interface UserAccount {
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
  }