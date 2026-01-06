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

  /**
   * BUG #9 (Debugger): Coupon applies wrong discount (off by 1)
   * Returns discount - 1 instead of actual discount value
   */
  validateCoupon(code: string): CouponResult {
    const normalizedCode = code.trim().toUpperCase();

    console.log('Validating coupon:', normalizedCode);

    if (normalizedCode in this.validCoupons) {
      // BUG: Subtracts 1 from the discount percentage!
      const discount = this.validCoupons[normalizedCode] - 1;

      return {
        valid: true,
        discount,
        message: `Coupon applied! ${discount}% off`
      };
    }

    return {
      valid: false,
      discount: 0,
      message: 'Invalid coupon code'
    };
  }

  /**
   * Get all valid coupon codes (for debugging)
   */
  getValidCoupons(): string[] {
    return Object.keys(this.validCoupons);
  }
}
