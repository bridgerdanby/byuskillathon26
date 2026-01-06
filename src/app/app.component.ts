import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductCategory } from './models';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { ToastService } from './services/toast.service';

// Components
import { HeaderComponent } from './components/header/header.component';
import { SearchComponent } from './components/search/search.component';
import { FilterComponent } from './components/filter/filter.component';
import { ProductsGridComponent } from './components/products-grid/products-grid.component';
import { CartSidebarComponent } from './components/cart-sidebar/cart-sidebar.component';
import { CheckoutModalComponent } from './components/checkout-modal/checkout-modal.component';
import { SuccessToastComponent } from './components/success-toast/success-toast.component';
import { DebugPanelComponent } from './components/debug-panel/debug-panel.component';

/**
 * Main Application Component
 * Orchestrates all child components and manages application state
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SearchComponent,
    FilterComponent,
    ProductsGridComponent,
    CartSidebarComponent,
    CheckoutModalComponent,
    SuccessToastComponent,
    DebugPanelComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  showCheckoutModal = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService
  ) {
    // Expose services for debugging in console
    (window as any).buggyMart = {
      productService: this.productService,
      cartService: this.cartService,
      toastService: this.toastService
    };

    console.log('🛒 BuggyMart Angular App loaded!');
    console.log('💡 Tip: This app has intentional bugs for learning Chrome DevTools!');
    console.log('🔧 Access window.buggyMart for debugging.');
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  onSearch(query: string): void {
    this.loading = true;

    this.productService.searchProducts(query).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Search failed. Please try again.';
        this.loading = false;
        console.error('Search error:', err);
      }
    });
  }

  onFilterChange(category: ProductCategory | 'all'): void {
    this.loading = true;

    this.productService.filterByCategory(category).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Filter failed. Please try again.';
        this.loading = false;
        console.error('Filter error:', err);
      }
    });
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.toastService.showSuccess(`${product.name} added to cart!`);
  }

  openCheckout(): void {
    this.showCheckoutModal = true;
  }

  closeCheckout(): void {
    this.showCheckoutModal = false;
  }

  onOrderPlaced(): void {
    this.showCheckoutModal = false;
    this.toastService.showSuccess('Order placed successfully!');
  }
}
