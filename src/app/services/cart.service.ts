import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, CartItem, Order, CheckoutFormData } from '../models';

/**
 * Cart Service - Manages shopping cart state
 * Contains INTENTIONAL BUGS for DevTools demo
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems$ = new BehaviorSubject<CartItem[]>([]);
  private cartOpen$ = new BehaviorSubject<boolean>(false);
  private appliedDiscount = 0;

  constructor() {
    // Expose for debugging in console
    (window as any).buggyMartCart = this;
    console.log('🛒 CartService initialized. Access via window.buggyMartCart');
  }

  /**
   * Get cart items observable
   */
  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$.asObservable();
  }

  /**
   * Get current cart items value
   */
  getCartItemsSnapshot(): CartItem[] {
    return this.cartItems$.getValue();
  }

  /**
   * Add product to cart
   */
  addToCart(product: Product): void {
    const currentItems = this.cartItems$.getValue();
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItems$.next([...currentItems]);
    } else {
      const newItem: CartItem = {
        ...product,
        quantity: 1
      };
      this.cartItems$.next([...currentItems, newItem]);
    }

    console.log('Cart updated:', this.cartItems$.getValue());
  }

  /**
   * Remove item from cart
   */
  removeFromCart(productId: number): void {
    const currentItems = this.cartItems$.getValue();
    const filtered = currentItems.filter(item => item.id !== productId);
    this.cartItems$.next(filtered);
  }

  /**
   * Update item quantity
   */
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems$.getValue();
    const item = currentItems.find(i => i.id === productId);
    if (item) {
      item.quantity = quantity;
      this.cartItems$.next([...currentItems]);
    }
  }

  calculateTotal(): number {
    const items = this.cartItems$.getValue();

    let total: any = '';

    for (const item of items) {
      total += item.price * item.quantity;
    }

    return parseFloat(total) || 0;
  }

  /**
   * Get cart total as observable (recalculates on cart changes)
   */
  getCartTotal(): Observable<number> {
    return new Observable(subscriber => {
      this.cartItems$.subscribe(() => {
        subscriber.next(this.calculateTotal());
      });
    });
  }

  /**
   * Get total item count
   */
  getItemCount(): number {
    return this.cartItems$.getValue().reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Cart sidebar visibility
   */
  openCart(): void {
    this.cartOpen$.next(true);
  }

  closeCart(): void {
    this.cartOpen$.next(false);
  }

  toggleCart(): void {
    this.cartOpen$.next(!this.cartOpen$.getValue());
  }

  isCartOpen(): Observable<boolean> {
    return this.cartOpen$.asObservable();
  }

  /**
   * Set discount percentage
   */
  setDiscount(percentage: number): void {
    this.appliedDiscount = percentage;
  }

  /**
   * Get final total with discount
   */
  getFinalTotal(): number {
    const subtotal = this.calculateTotal();
    const discount = subtotal * (this.appliedDiscount / 100);
    return subtotal - discount;
  }

  /**
   * Clear cart after successful checkout
   */
  clearCart(): void {
    this.cartItems$.next([]);
    this.appliedDiscount = 0;
  }

  /**
   * Process checkout
   */
  processCheckout(formData: CheckoutFormData): Order {
    const items = this.cartItems$.getValue();
    const subtotal = this.calculateTotal();
    const discount = subtotal * (this.appliedDiscount / 100);

    const order: Order = {
      customer: formData,
      items: [...items],
      subtotal,
      discount,
      total: subtotal - discount,
      timestamp: new Date()
    };

    console.log('Processing order:', order);

    this.clearCart();
    this.closeCart();

    return order;
  }
}
