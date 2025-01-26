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
  selector: '[appPopoverLabel]',
  standalone: true,
})
export class PopoverLabelDirective {
  el = inject(ElementRef);
  renderer = inject(Renderer2);

  popoverLabelText = input('Popover text here');
  popoverLabelPosition = input<
    | 'centeredTopLeft'
    | 'centeredTopRight'
    | 'centeredBottomLeft'
    | 'centeredBottomRight'
  >('centeredTopLeft');
  popoverLabelAlwaysShow = input(false);
  popoverLabelTopPosition = input('-130%');
  popoverLabelBottomPosition = input('130%');

  popoverLabelTextEl = input<HTMLElement>(this.el.nativeElement);
  private popoverElement: HTMLElement | null = null;

  @HostListener('mouseenter') onMouseEnter() {
    if (
      this.popoverLabelTextEl().scrollWidth >
        this.popoverLabelTextEl().clientWidth ||
      this.popoverLabelAlwaysShow()
    ) {
      this.createPopover();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.removePopover();
  }

  private createPopover() {
    // Ensure the popover is not already created
    if (!this.popoverElement) {
      this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');

      const allPopoverElements =
        document.querySelectorAll('.popover-directive');
      allPopoverElements.forEach((el) => el.remove());

      this.popoverElement = this.renderer.createElement('div');
      this.popoverElement?.classList.add('popover-directive');

      // Apply styles for the popover container
      this.renderer.setStyle(this.popoverElement, 'position', 'absolute');

      if (this.popoverLabelPosition() === 'centeredTopLeft') {
        this.renderer.setStyle(
          this.popoverElement,
          'top',
          this.popoverLabelTopPosition()
        );
        this.renderer.setStyle(this.popoverElement, 'left', '0px');
      }

      if (this.popoverLabelPosition() === 'centeredTopRight') {
        this.renderer.setStyle(
          this.popoverElement,
          'top',
          this.popoverLabelTopPosition()
        );
        this.renderer.setStyle(this.popoverElement, 'right', '0px');
      }

      if (this.popoverLabelPosition() === 'centeredBottomRight') {
        this.renderer.setStyle(
          this.popoverElement,
          'bottom',
          this.popoverLabelBottomPosition()
        );
        this.renderer.setStyle(this.popoverElement, 'right', '0px');
      }

      if (this.popoverLabelPosition() === 'centeredBottomLeft') {
        this.renderer.setStyle(
          this.popoverElement,
          'top',
          this.popoverLabelBottomPosition()
        );
        this.renderer.setStyle(this.popoverElement, 'left', '0px');
      }

      this.renderer.setStyle(
        this.popoverElement,
        'background',
        'var(--lokey-theme-colors-primaryActive)'
      );
      this.renderer.setStyle(
        this.popoverElement,
        'color',
        'var(--lokey-theme-colors-white)'
      );
      this.renderer.setStyle(
        this.popoverElement,
        'padding',
        'var(--lokey-theme-spacing-sm)'
      );
      this.renderer.setStyle(
        this.popoverElement,
        'border-radius',
        'var(--lokey-theme-borderRadius-small)'
      );
      this.renderer.setStyle(
        this.popoverElement,
        'font-size',
        'var(--lokey-theme-typography-captionSize)'
      );
      this.renderer.setStyle(
        this.popoverElement,
        'line-height',
        'var(--lokey-theme-typography-captionLineHeight)'
      );
      this.renderer.setStyle(
        this.popoverElement,
        'box-shadow',
        'var(--lokey-theme-shadows-medium)'
      );
      this.renderer.setStyle(this.popoverElement, 'white-space', 'nowrap');
      this.renderer.setStyle(
        this.popoverElement,
        'z-index',
        'var(--lokey-theme-zIndex-zIndexTooltip)'
      );
      this.renderer.setStyle(this.popoverElement, 'opacity', '0');
      this.renderer.setStyle(
        this.popoverElement,
        'transition',
        'opacity var(--lokey-theme-animation-medium) var(--lokey-theme-animation-easeOut)'
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

  private removePopover() {
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
