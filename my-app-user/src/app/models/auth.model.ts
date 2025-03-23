export interface LoginResponse {
    token: string;
    customerId: string;
    email: string;
    buying_points?: number;
  }

export interface RegisterRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface ForgotPasswordRequest {
    email: string;
  }
  
  export interface ResetPasswordRequest {
    email: string;
    newPassword: string;
  }
  
  export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
  }
  export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string; // Chỉ kiểm tra ở frontend
  }