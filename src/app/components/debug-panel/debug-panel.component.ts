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

  async triggerRaceCondition(): Promise<void> {
    this.debugOutput = 'Loading data...';
    this.dataReady = false;

    this.loadDataAsync();

    await this.validateSession();
    await this.checkPermissions();

    if (this.dataReady) {
      this.debugOutput = 'Data loaded: ' + this.userCache.get(1)?.name;
    } else {
      this.debugOutput = 'Error: Data not ready yet!';
    }
  }

  private loadDataAsync(): void {
    this.fetchUserProfile(1);
  }

  private fetchUserProfile(userId: number): void {
    this.simulateNetworkRequest(() => {
      this.userCache.set(userId, { name: 'John Doe', role: 'Admin' });
      this.dataReady = true;
    });
  }

  private simulateNetworkRequest(callback: () => void): void {
    setTimeout(callback, 100);
  }

  private async validateSession(): Promise<void> {
    await this.delay(10);
  }

  private async checkPermissions(): Promise<void> {
    await this.delay(10);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
