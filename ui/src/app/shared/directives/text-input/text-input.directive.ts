import {
  Directive,
  HostBinding,
  ElementRef,
  Renderer2,
  AfterViewInit,
  input,
  effect,
  inject,
  HostListener,
  model,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export type IVariant = 'default' | 'sm';

@Directive({
  standalone: true,
  selector: '[appTextInput]',
})
export class TextInputDirective implements AfterViewInit {
  el = inject(ElementRef);
  renderer = inject(Renderer2);
  platformId = inject(PLATFORM_ID);

  variant = input<IVariant>('default');
  placeholder = input('');
  errorMessage = model('');

  wrapperElement?: HTMLDivElement;
  errorMessageElement?: HTMLDivElement;
  placeholderElement?: HTMLElement;

  @HostBinding('class.text-input-directive__default')
  @HostBinding('class.text-directive__paragraph')
  get isDefault() {
    return this.variant() === 'default';
  }

  @HostBinding('class.text-input-directive__sm')
  @HostBinding('class.text-directive__paragraph')
  get isSmall() {
    return this.variant() === 'sm';
  }

  @HostListener('focus') onfocus() {}

  @HostListener('input', ['$event.target.value'])
  onInputChange(value: string) {
    if (value !== this.errorMessage()) {
      this.errorMessage.set('');
    }
  }

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        const nativeElement: HTMLInputElement = this.el.nativeElement;
        if (this.errorMessage() && this.wrapperElement) {
          nativeElement.classList.add('text-input-directive__default--error');
        } else {
          nativeElement.classList.remove(
            'text-input-directive__default--error'
          );
        }

        const messageElement = this.wrapperElement?.lastChild as HTMLElement;
        if (messageElement) messageElement.innerText = this.errorMessage();
      });

      effect(() => {
        const placeholder = this.placeholder();
        if (this.placeholderElement) {
          this.renderer.setProperty(
            this.placeholderElement,
            'innerText',
            placeholder
          );
        }
      });
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Create a wrapper div
      this.wrapperElement = this.renderer.createElement('div');
      this.renderer.addClass(
        this.wrapperElement,
        'text-input-directive__default__wrapper'
      );

      // Create the small element
      this.placeholderElement = this.renderer.createElement('small');
      this.renderer.addClass(
        this.placeholderElement,
        'text-input-directive__default__placeholder'
      );
      this.renderer.addClass(
        this.placeholderElement,
        'text-directive__title-sm'
      );
      this.renderer.setProperty(
        this.placeholderElement,
        'innerText',
        this.placeholder()
      );

      // Wrap the input
      const nativeElement: HTMLInputElement = this.el.nativeElement;
      nativeElement.setAttribute('placeholder', '');
      const parent = nativeElement.parentNode;

      // Create the message element
      this.errorMessageElement = this.renderer.createElement('small');
      this.renderer.addClass(
        this.errorMessageElement,
        'text-input-directive__default__message'
      );
      this.renderer.addClass(
        this.errorMessageElement,
        'text-directive__info-sm'
      );

      this.renderer.insertBefore(parent, this.wrapperElement, nativeElement);
      this.renderer.appendChild(this.wrapperElement, nativeElement);
      this.renderer.appendChild(this.wrapperElement, this.placeholderElement);
      this.renderer.appendChild(this.wrapperElement, this.errorMessageElement);
    }
  }
}
