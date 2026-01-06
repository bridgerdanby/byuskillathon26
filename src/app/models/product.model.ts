/**
 * Product model for BuggyMart
 */
export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  emoji: string;
}

export type ProductCategory = 'electronics' | 'clothing' | 'food';

export const PRODUCT_CATEGORIES: ProductCategory[] = ['electronics', 'clothing', 'food'];
