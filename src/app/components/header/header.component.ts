import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';

/**
 * Header Component - App header with cart icon
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemCount = 0;
  private subscription?: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.subscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  openCart(): void {
    this.cartService.openCart();
  }
}
