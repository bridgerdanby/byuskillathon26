import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

/**
 * Debug Panel Component - Demonstrates console errors, network issues, and async bugs
 * Contains intentional bugs for DevTools demonstration
 */
@Component({
  selector: 'app-debug-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './debug-panel.component.html',
  styleUrls: ['./debug-panel.component.css']
})
export class DebugPanelComponent {
  debugOutput = '';

  constructor(private productService: ProductService) {}

  /**
   * BUG #12 (Debugger/Console): Accessing undefined nested property
   * Triggers a TypeError that students can find in the Console
   */
  triggerConsoleError(): void {
    this.debugOutput = 'Check the Console tab for errors...';

    console.log('About to access undefined property...');

    const obj: any = { name: 'test' };
    // BUG: Accessing undefined nested property causes crash
    console.log('Nested value:', obj.details.nested.value);
  }

  /**
   * BUG #10 & #11 (Network): Fetches from invalid endpoint with no error handling
   * Shows how to identify failed requests in Network panel
   */
  fetchExternalData(): void {
    this.debugOutput = 'Fetching data... (check Network tab)';

    // BUG: Wrong endpoint and missing error handling
    this.productService.fetchExternalData().subscribe({
      next: (data) => {
        this.debugOutput = 'Data received: ' + JSON.stringify(data, null, 2);
      }
      // BUG: Missing error handler!
    });
  }

  /**
   * BUG #13 (Debugger): Async timing issue - displays "pending" immediately
   * Demonstrates misunderstanding of async JavaScript
   */
  slowOperation(): void {
    this.debugOutput = 'Starting slow operation...';

    let result = 'pending';

    // Simulate async operation
    setTimeout(() => {
      result = 'completed';
      console.log('Operation finished, result:', result);
    }, 2000);

    // BUG: This runs immediately, before setTimeout callback
    this.debugOutput = `Operation result: ${result}`;
    console.log('Displayed result:', result); // Will show "pending"
  }

  /**
   * Helper to demonstrate proper async handling (for teaching)
   */
  slowOperationFixed(): void {
    this.debugOutput = 'Starting slow operation (fixed)...';

    setTimeout(() => {
      const result = 'completed';
      this.debugOutput = `Operation result: ${result}`;
      console.log('Operation finished, result:', result);
    }, 2000);
  }
}
