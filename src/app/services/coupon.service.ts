import { Injectable } from '@angular/core';

/**
 * Coupon validation result
 */
export interface CouponResult {
  valid: boolean;
  discount: number;
  message: string;
}

/**
 * Coupon Service - Validates and applies discount coupons
 * Contains INTENTIONAL BUG for DevTools demo
 */
@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private readonly validCoupons: Record<string, number> = {
    'SAVE10': 10,
    'SAVE20': 20,
    'STUDENT': 15,
    'BUGGY50': 50
  };

  constructor() {
    // Expose for debugging
    (window as any).buggyMartCoupons = this.validCoupons;
    console.log('💰 CouponService initialized. Valid coupons:', Object.keys(this.validCoupons));
  }

  validateCoupon(code: string): CouponResult {
    const normalizedCode = code.trim().toUpperCase();

    if (normalizedCode in this.validCoupons) {
      const baseDiscount = this.validCoupons[normalizedCode];
      const finalDiscount = this.processCouponDiscount(baseDiscount, normalizedCode);

      return {
        valid: true,
        discount: finalDiscount,
        message: `Coupon applied! ${finalDiscount}% off`
      };
    }

    return {
      valid: false,
      discount: 0,
      message: 'Invalid coupon code'
    };
  }

  private processCouponDiscount(discount: number, code: string): number {
    const adjusted = discount - 1;
    return this.applyToCart(adjusted, code);
  }

  private applyToCart(discount: number, code: string): number {
    return this.finalizeDiscount(discount, code);
  }

  private finalizeDiscount(discount: number, code: string): number {
    // Breakpoint here: discount is already 9, not 10!
    // Use call stack to trace back and find where it became 9
    return discount;
  }

  /**
   * Get all valid coupon codes (for debugging)
   */
  getValidCoupons(): string[] {
    return Object.keys(this.validCoupons);
  }
}
