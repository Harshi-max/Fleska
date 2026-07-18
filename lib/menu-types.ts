// Menu Item Types
export interface MenuItem {
  sku: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

// Cart Item Type
export interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Order Type
export interface OrderData {
  items: CartItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  paymentMethod: 'CARD' | 'CASH';
  userId?: string;
}

// User Type
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

// Auth Response
export interface AuthResponse {
  user?: User;
  error?: string;
}
