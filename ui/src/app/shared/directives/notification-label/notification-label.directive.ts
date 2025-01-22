import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appNotificationLabel]',
  standalone: true,
})
export class NotificationLabelDirective {
  @Input() notifyLabelText: string = 'Copied!';

  private labelElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click') onClick() {
    // Set the relative position of the host element
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');

    const allPopoverElements = document.querySelectorAll('.popover-directive');
    allPopoverElements.forEach((el) => el.remove());

    if (!this.labelElement) {
      this.labelElement = this.renderer.createElement('span');

      // Apply styles using the provided theme variables
      this.renderer.setStyle(this.labelElement, 'position', 'absolute');
      this.renderer.setStyle(this.labelElement, 'top', '-100%');
      this.renderer.setStyle(this.labelElement, 'left', '0');
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
      const text = this.renderer.createText(this.notifyLabelText);
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
