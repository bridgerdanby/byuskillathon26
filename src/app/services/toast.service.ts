import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

/**
 * Toast Service - Shows notification messages
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toast$ = new BehaviorSubject<Toast>({
    message: '',
    type: 'success',
    visible: false
  });

  getToast(): Observable<Toast> {
    return this.toast$.asObservable();
  }

  showSuccess(message: string): void {
    this.toast$.next({
      message,
      type: 'success',
      visible: true
    });

    setTimeout(() => this.hide(), 2000);
  }

  showError(message: string): void {
    this.toast$.next({
      message,
      type: 'error',
      visible: true
    });

    setTimeout(() => this.hide(), 3000);
  }

  showInfo(message: string): void {
    this.toast$.next({
      message,
      type: 'info',
      visible: true
    });

    setTimeout(() => this.hide(), 2000);
  }

  hide(): void {
    const current = this.toast$.getValue();
    this.toast$.next({ ...current, visible: false });
  }
}
