import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../services/toast.service';

/**
 * Success Toast Component - Notification popup
 * Contains CSS bug (opacity issue)
 */
@Component({
  selector: 'app-success-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-toast.component.html',
  styleUrls: ['./success-toast.component.css']
})
export class SuccessToastComponent implements OnInit, OnDestroy {
  toast: Toast = { message: '', type: 'success', visible: false };
  private subscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.getToast().subscribe(toast => {
      this.toast = toast;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
