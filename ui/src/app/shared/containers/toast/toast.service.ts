import { Injectable, signal } from '@angular/core';

interface IToast {
  message: string;
  correlation_id?: string;
  dateTime: Date;
  duration: number;
  type: 'success' | 'error' | 'warning';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<IToast[]>([]);
  isOpen = signal(false);
  private closeTimeoutId: ReturnType<typeof setTimeout> | null = null;

  add(
    message: string,
    correlation_id?: string,
    type: IToast['type'] = 'success',
    duration = 300000,
    dateTime = new Date()
  ) {
    const toast: IToast = { message, duration, dateTime, type, correlation_id };
    this.toasts.update((toasts) => [...toasts, toast]);
    setTimeout(() => this.remove(0), duration);

    this.setIsOpen(true);
  }

  remove(index: number) {
    this.toasts.update((toasts) => toasts.filter((_, i) => i !== index));
    if (this.toasts().length === 0) {
      this.setIsOpen(false);
    }
  }

  clear() {
    this.toasts.update(() => []);
    this.setIsOpen(false);
  }

  setIsOpen(state: boolean) {
    if (state) {
      this.isOpen.set(true);
      this.resetCloseTimeout();
    } else {
      this.isOpen.set(false);
      this.clearCloseTimeout();
    }
  }

  private resetCloseTimeout() {
    this.clearCloseTimeout();
    this.closeTimeoutId = setTimeout(() => this.isOpen.set(false), 30000);
  }

  private clearCloseTimeout() {
    if (this.closeTimeoutId !== null) {
      clearTimeout(this.closeTimeoutId);
      this.closeTimeoutId = null;
    }
  }
}
