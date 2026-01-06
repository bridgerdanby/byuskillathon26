import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategory, PRODUCT_CATEGORIES } from '../../models';

type FilterCategory = ProductCategory | 'all';

/**
 * Filter Component - Category filter buttons
 */
@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  categories: FilterCategory[] = ['all', ...PRODUCT_CATEGORIES];
  activeCategory: FilterCategory = 'all';

  @Output() filterChange = new EventEmitter<FilterCategory>();

  selectCategory(category: FilterCategory): void {
    this.activeCategory = category;
    this.filterChange.emit(category);
  }

  getCategoryLabel(category: FilterCategory): string {
    if (category === 'all') return 'All';
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
}
