import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models';
import { ProductCardComponent } from '../product-card/product-card.component';

/**
 * Products Grid Component - Displays product cards in a grid
 * Contains CSS bug (flexbox nowrap issue)
 */
@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.css']
})
export class ProductsGridComponent {
  @Input() products: Product[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart(product: Product): void {
    this.addToCart.emit(product);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
