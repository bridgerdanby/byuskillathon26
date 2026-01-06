import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../models';

/**
 * Cart Item Component - Single item in the cart
 */
@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() remove = new EventEmitter<number>();

  onRemove(): void {
    this.remove.emit(this.item.id);
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}
