import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, delay, catchError } from 'rxjs';
import { Product, ProductCategory } from '../models';

/**
 * Product Service - Manages product data and filtering
 * Contains INTENTIONAL BUGS for DevTools demo
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly products: Product[] = [
    { id: 1, name: 'Wireless Headphones', category: 'electronics', price: 79.99, emoji: '🎧' },
    { id: 2, name: 'Smart Watch', category: 'electronics', price: 199.99, emoji: '⌚' },
    { id: 3, name: 'Laptop Stand', category: 'electronics', price: 45.99, emoji: '💻' },
    { id: 4, name: 'USB-C Hub', category: 'electronics', price: 34.99, emoji: '🔌' },
    { id: 5, name: 'Winter Jacket', category: 'clothing', price: 89.99, emoji: '🧥' },
    { id: 6, name: 'Running Shoes', category: 'clothing', price: 120.00, emoji: '👟' },
    { id: 7, name: 'Sunglasses', category: 'clothing', price: 55.00, emoji: '🕶️' },
    { id: 8, name: 'Backpack', category: 'clothing', price: 65.99, emoji: '🎒' },
    { id: 9, name: 'Organic Coffee', category: 'food', price: 15.99, emoji: '☕' },
    { id: 10, name: 'Dark Chocolate', category: 'food', price: 8.99, emoji: '🍫' },
    { id: 11, name: 'Mixed Nuts', category: 'food', price: 12.50, emoji: '🥜' },
    { id: 12, name: 'Green Tea Set', category: 'food', price: 24.99, emoji: '🍵' }
  ];

  private filteredProducts$ = new BehaviorSubject<Product[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);
  private currentFilter: ProductCategory | 'all' = 'all';

  constructor(private http: HttpClient) {}

  /**
   * Get all products with simulated loading delay
   */
  getProducts(): Observable<Product[]> {
    this.loading$.next(true);

    // Simulate network delay
    return of(this.getFilteredProductList()).pipe(
      delay(800)
    );
  }

  /**
   * BUG #6 (Debugger): Off-by-one error in loop
   * This method skips the first product!
   */
  private getFilteredProductList(): Product[] {
    const sourceProducts = this.currentFilter === 'all'
      ? this.products
      : this.products.filter(p => p.category === this.currentFilter);

    const result: Product[] = [];

    // BUG: Loop starts at 1 instead of 0, skipping first product
    for (let i = 1; i <= sourceProducts.length; i++) {
      const product = sourceProducts[i];
      if (product) {
        result.push(product);
      }
    }

    this.loading$.next(false);
    return result;
  }

  /**
   * Filter products by category
   */
  filterByCategory(category: ProductCategory | 'all'): Observable<Product[]> {
    this.currentFilter = category;
    return this.getProducts();
  }

  /**
   * BUG #7 (Debugger): Search uses == instead of includes()
   * Only finds exact matches, not partial matches
   */
  searchProducts(query: string): Observable<Product[]> {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
      return this.getProducts();
    }

    // BUG: Uses == for comparison instead of includes()
    const results = this.products.filter(product => {
      return product.name.toLowerCase() == searchTerm;
    });

    return of(results).pipe(delay(300));
  }

  /**
   * Get a single product by ID
   */
  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  /**
   * BUG #10 & #11 (Network): Fetches from invalid endpoint with no error handling
   */
  fetchExternalData(): Observable<any> {
    // BUG: Wrong endpoint URL
    return this.http.get('https://jsonplaceholder.typicode.com/invalid-endpoint/999');
    // BUG: Missing error handling - no catchError!
  }

  /**
   * Get loading state
   */
  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}
