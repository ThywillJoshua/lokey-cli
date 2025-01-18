import { Directive, HostBinding, input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appCheckbox]',
})
export class CheckboxDirective {
  @HostBinding('class.checkbox-container')
  @HostBinding('class.text-directive__text')
  disabled = input(false);

  @HostBinding('class.checkbox-container--disabled') get isDisabled() {
    return this.disabled();
  }
}
