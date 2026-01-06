import { Product } from './product.model';

/**
 * Cart item extends product with quantity
 */
export interface CartItem extends Product {
  quantity: number;
}

/**
 * Checkout form data
 */
export interface CheckoutFormData {
  name: string;
  email: string;
  cardNumber: string;
  couponCode?: string;
}

/**
 * Order data for submission
 */
export interface Order {
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  timestamp: Date;
}
