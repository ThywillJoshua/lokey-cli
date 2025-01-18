import { Directive, HostBinding, input } from '@angular/core';

export type IVariant =
  | 'paragraph'
  | 'paragraph-bold'
  | 'info'
  | 'info-sm'
  | 'title'
  | 'title-sm';

@Directive({
  standalone: true,
  selector: '[appText]',
})
export class TextDirective {
  variant = input<IVariant>('paragraph');

  @HostBinding('class.text-directive__paragraph')
  get isParagraph() {
    return this.variant() === 'paragraph';
  }

  @HostBinding('class.text-directive__paragraph-bold')
  get isParagraphBold() {
    return this.variant() === 'paragraph-bold';
  }

  @HostBinding('class.text-directive__info')
  get isInfo() {
    return this.variant() === 'info';
  }

  @HostBinding('class.text-directive__info-sm')
  get isInfoSM() {
    return this.variant() === 'info-sm';
  }

  @HostBinding('class.text-directive__title')
  get isTitle() {
    return this.variant() === 'title';
  }

  @HostBinding('class.text-directive__title-sm')
  get isTitleSM() {
    return this.variant() === 'title-sm';
  }
}
