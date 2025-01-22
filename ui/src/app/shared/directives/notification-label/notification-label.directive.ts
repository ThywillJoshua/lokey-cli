import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  Input,
  input,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appNotificationLabel]',
  standalone: true,
})
export class NotificationLabelDirective {
  el = inject(ElementRef);
  renderer = inject(Renderer2);

  notifyLabelText = input('Copied!');
  notificationLabelPosition = input<
    | 'centeredTopLeft'
    | 'centeredTopRight'
    | 'centeredBottomLeft'
    | 'centeredBottomRight'
  >('centeredTopLeft');

  private labelElement: HTMLElement | null = null;

  @HostListener('click') onClick() {
    // Set the relative position of the host element
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');

    const allPopoverElements = document.querySelectorAll('.popover-directive');
    allPopoverElements.forEach((el) => el.remove());

    if (!this.labelElement) {
      this.labelElement = this.renderer.createElement('span');

      // Apply styles using the provided theme variables
      this.renderer.setStyle(this.labelElement, 'position', 'absolute');
      if (this.notificationLabelPosition() === 'centeredTopLeft') {
        this.renderer.setStyle(this.labelElement, 'top', '-100%');
        this.renderer.setStyle(this.labelElement, 'left', '0px');
      }

      if (this.notificationLabelPosition() === 'centeredTopRight') {
        this.renderer.setStyle(this.labelElement, 'top', '-100%');
        this.renderer.setStyle(this.labelElement, 'right', '0px');
      }

      if (this.notificationLabelPosition() === 'centeredBottomRight') {
        this.renderer.setStyle(this.labelElement, 'bottom', '-100%');
        this.renderer.setStyle(this.labelElement, 'right', '0px');
      }

      if (this.notificationLabelPosition() === 'centeredBottomLeft') {
        this.renderer.setStyle(this.labelElement, 'top', '-100%');
        this.renderer.setStyle(this.labelElement, 'left', '0px');
      }
      this.renderer.setStyle(
        this.labelElement,
        'background',
        'var(--echo-theme-colors-success)'
      );
      this.renderer.setStyle(
        this.labelElement,
        'color',
        'var(--echo-theme-colors-white)'
      );
      this.renderer.setStyle(
        this.labelElement,
        'padding',
        'var(--echo-theme-spacing-xs)'
      );
      this.renderer.setStyle(
        this.labelElement,
        'border-radius',
        'var(--echo-theme-borderRadius-small)'
      );
      this.renderer.setStyle(
        this.labelElement,
        'font-size',
        'var(--echo-theme-typography-captionSize)'
      );
      this.renderer.setStyle(
        this.labelElement,
        'line-height',
        'var(--echo-theme-typography-captionLineHeight)'
      );
      this.renderer.setStyle(
        this.labelElement,
        'box-shadow',
        'var(--echo-theme-shadows-shadowActive)'
      );
      this.renderer.setStyle(
        this.labelElement,
        'z-index',
        'var(--echo-theme-zIndex-zIndexTooltip)'
      );
      this.renderer.setStyle(
        this.labelElement,
        'transition',
        'opacity var(--echo-theme-animation-medium) var(--echo-theme-animation-easeOut)'
      );
      this.renderer.setStyle(this.labelElement, 'opacity', '1');

      // Add the notification text
      const text = this.renderer.createText(this.notifyLabelText());
      this.renderer.appendChild(this.labelElement, text);
      this.renderer.appendChild(this.el.nativeElement, this.labelElement);

      // Add animation and removal logic
      setTimeout(() => {
        if (this.labelElement) {
          this.renderer.setStyle(this.labelElement, 'opacity', '0');
          setTimeout(() => {
            if (this.labelElement) {
              this.renderer.removeChild(
                this.el.nativeElement,
                this.labelElement
              );
              this.labelElement = null;
            }
          }, 300);
        }
      }, 2000);
    }
  }
}
