import { Component, computed, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { TextDirective } from '../../directives/text/text.directive';
import { ButtonDirective } from '../../directives/button/button.directive';

@Component({
  standalone: true,
  selector: 'app-toast',
  imports: [UpperCasePipe, DatePipe, TextDirective, ButtonDirective],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  toastService = inject(ToastService);

  toasts = computed(() => this.toastService.toasts().reverse());
}
