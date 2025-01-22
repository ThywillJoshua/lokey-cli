import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  input,
} from '@angular/core';

@Directive({
  selector: '[appPopoverLabel]',
  standalone: true,
})
export class PopoverLabelDirective {
  popoverLabelText = input('Popover text here');

  private popoverElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');

    if (!this.popoverElement) {
      this.popoverElement = this.renderer.createElement('div');

      // Apply styles for the popover container
      this.renderer.setStyle(this.popoverElement, 'position', 'absolute');
      this.renderer.setStyle(this.popoverElement, 'top', '-130%');
      this.renderer.setStyle(
        this.popoverElement,
        'left',
        'var(--echo-theme-spacing-xl)'
      );
      this.renderer.setStyle(
        this.popoverElement,
        'background',
        'var(--echo-theme-colors-primaryActive)'
      );
      this.renderer.setStyle(
        this.popoverElement,
        'color',
        'var(--echo-theme-colors-white)'
      );
      this.renderer.setStyle(
        this.popoverElement,
        'padding',
        'var(--echo-theme-spacing-sm)'
      );
      this.renderer.setStyle(
        this.popoverElement,
        'border-radius',
        'var(--echo-theme-borderRadius-small)'
      );
      this.renderer.setStyle(
        this.popoverElement,
        'font-size',
        'var(--echo-theme-typography-captionSize)'
      );
      this.renderer.setStyle(
        this.popoverElement,
        'line-height',
        'var(--echo-theme-typography-captionLineHeight)'
      );
      this.renderer.setStyle(
        this.popoverElement,
        'box-shadow',
        'var(--echo-theme-shadows-medium)'
      );
      this.renderer.setStyle(this.popoverElement, 'white-space', 'nowrap');
      this.renderer.setStyle(
        this.popoverElement,
        'z-index',
        'var(--echo-theme-zIndex-zIndexTooltip)'
      );
      this.renderer.setStyle(this.popoverElement, 'opacity', '0');
      this.renderer.setStyle(
        this.popoverElement,
        'transition',
        'opacity var(--echo-theme-animation-medium) var(--echo-theme-animation-easeOut)'
      );
      this.renderer.setStyle(this.popoverElement, 'pointer-events', 'none');

      // Create a <span> element for the text
      const spanElement = this.renderer.createElement('span');
      const text = this.renderer.createText(this.popoverLabelText());
      this.renderer.appendChild(spanElement, text);
      this.renderer.appendChild(this.popoverElement, spanElement);

      // Append the popover to the host element
      this.renderer.appendChild(this.el.nativeElement, this.popoverElement);

      // Trigger fade-in
      setTimeout(() => {
        if (this.popoverElement) {
          this.renderer.setStyle(this.popoverElement, 'opacity', '1');
        }
      }, 50);
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.popoverElement) {
      // Trigger fade-out
      this.renderer.setStyle(this.popoverElement, 'opacity', '0');
      setTimeout(() => {
        if (this.popoverElement) {
          this.renderer.removeChild(this.el.nativeElement, this.popoverElement);
          this.popoverElement = null;
        }
      }, 300); // Matches transition duration
    }
  }
}
