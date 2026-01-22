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
      const finalDiscount = this.processDiscount(baseDiscount);

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

  private processDiscount(discount: number): number {
    const adjusted = this.applyFees(discount);
    return adjusted;
  }

  private applyFees(amount: number): number {
    return amount - 1;
  }

  /**
   * Get all valid coupon codes (for debugging)
   */
  getValidCoupons(): string[] {
    return Object.keys(this.validCoupons);
  }
}
