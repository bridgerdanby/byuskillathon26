import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CouponService, CouponResult } from '../../services/coupon.service';
import { CheckoutFormData } from '../../models';

/**
 * Checkout Modal Component - Checkout form with coupon support
 * Contains CSS bug (z-index lower than cart sidebar)
 */
@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-modal.component.html',
  styleUrls: ['./checkout-modal.component.css']
})
export class CheckoutModalComponent implements OnInit {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() orderPlaced = new EventEmitter<void>();

  formData: CheckoutFormData = {
    name: '',
    email: '',
    cardNumber: '',
    couponCode: ''
  };

  couponMessage = '';
  couponValid = false;
  appliedDiscount = 0;
  finalTotal = 0;

  constructor(
    private cartService: CartService,
    private couponService: CouponService
  ) {}

  ngOnInit(): void {
    this.updateFinalTotal();
  }

  applyCoupon(): void {
    if (!this.formData.couponCode) {
      this.couponMessage = 'Please enter a coupon code';
      this.couponValid = false;
      return;
    }

    const result: CouponResult = this.couponService.validateCoupon(this.formData.couponCode);

    this.couponMessage = result.message;
    this.couponValid = result.valid;
    this.appliedDiscount = result.discount;

    if (result.valid) {
      this.cartService.setDiscount(result.discount);
    }

    this.updateFinalTotal();
  }

  updateFinalTotal(): void {
    const subtotal = this.cartService.calculateTotal();
    const discount = subtotal * (this.appliedDiscount / 100);
    this.finalTotal = subtotal - discount;
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      alert('Please fill in all required fields');
      return;
    }

    this.cartService.processCheckout(this.formData);
    this.orderPlaced.emit();
    this.resetForm();
    this.onClose();

    alert('Order placed successfully! Thank you for shopping at BuggyMart!');
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.onClose();
    }
  }

  private isFormValid(): boolean {
    return !!(
      this.formData.name &&
      this.formData.email &&
      this.formData.cardNumber
    );
  }

  private resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      cardNumber: '',
      couponCode: ''
    };
    this.couponMessage = '';
    this.couponValid = false;
    this.appliedDiscount = 0;
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}
