import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartItem } from '../../models';
import { CartService } from '../../services/cart.service';
import { CartItemComponent } from '../cart-item/cart-item.component';

/**
 * Cart Sidebar Component - Sliding cart panel
 */
@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, CartItemComponent],
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.css']
})
export class CartSidebarComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  isOpen = false;
  cartTotal = 0;

  @Output() checkout = new EventEmitter<void>();

  private subscriptions: Subscription[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartService.getCartItems().subscribe(items => {
        this.cartItems = items;
        this.cartTotal = this.cartService.calculateTotal();
      }),
      this.cartService.isCartOpen().subscribe(isOpen => {
        this.isOpen = isOpen;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  closeCart(): void {
    this.cartService.closeCart();
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  onCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    this.checkout.emit();
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}
