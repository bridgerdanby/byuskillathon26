import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

/**
 * Debug Panel Component - Demonstrates Chrome DevTools debugger features
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
  private userCache: Map<number, any> = new Map();
  private dataReady = false;

  constructor(private productService: ProductService) {}

  triggerExceptionError(): void {
    this.debugOutput = 'Processing user data...';

    const userData: any = this.fetchUserData();
    const userName = userData.profile.settings.displayName;
    this.debugOutput = `Welcome, ${userName}!`;
  }

  private fetchUserData(): any {
    return {
      id: 123,
      email: 'user@example.com'
    };
  }

  triggerRaceCondition(): void {
    this.debugOutput = 'Loading data...';
    this.dataReady = false;

    this.loadDataAsync();

    if (this.dataReady) {
      this.debugOutput = 'Data loaded: ' + this.userCache.get(1)?.name;
    } else {
      this.debugOutput = 'Error: Data not ready yet!';
    }
  }

  private loadDataAsync(): void {
    setTimeout(() => {
      this.userCache.set(1, { name: 'John Doe', role: 'Admin' });
      this.dataReady = true;
    }, 100);
  }

  triggerRaceConditionFixed(): void {
    this.debugOutput = 'Loading data (fixed)...';
    this.dataReady = false;

    setTimeout(() => {
      this.userCache.set(1, { name: 'John Doe', role: 'Admin' });
      this.dataReady = true;

      if (this.dataReady) {
        this.debugOutput = 'Data loaded: ' + this.userCache.get(1)?.name;
      }
    }, 100);
  }
}
