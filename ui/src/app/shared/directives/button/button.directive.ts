import {
  ApplicationRef,
  createComponent,
  Directive,
  effect,
  ElementRef,
  HostBinding,
  inject,
  Injector,
  input,
  signal,
} from '@angular/core';
import { LoadingCircleComponent } from '../../containers/loading-circle/loading-circle.component';

export type IVariant = 'default' | 'cta';

@Directive({
  standalone: true,
  selector: '[appButton]',
})
export class ButtonDirective {
  variant = input<IVariant>('default');
  isLoading = input(false);

  el = inject(ElementRef);
  appRef = inject(ApplicationRef);
  injector = inject(Injector);

  prevInnerHtml = signal<string | null>(null);
  loadingCircleComponent = LoadingCircleComponent;

  constructor() {
    effect(() => {
      const nativeEl = this.el.nativeElement as HTMLButtonElement;

      if (this.isLoading()) {
        // Save current content
        this.prevInnerHtml.set(nativeEl.innerHTML);

        // Clear existing content
        nativeEl.innerHTML = '';

        // Dynamically create and render the LoadingCircleComponent
        const loadingComponent = createComponent(LoadingCircleComponent, {
          environmentInjector: this.appRef.injector,
          hostElement: nativeEl,
        });

        this.appRef.attachView(loadingComponent.hostView);
      } else {
        // Restore previous content
        if (this.prevInnerHtml()) {
          nativeEl.innerHTML = this.prevInnerHtml()!;
        }
      }
    });
  }

  @HostBinding('class.button-directive__default')
  get isDefault() {
    return this.variant() === 'default';
  }

  @HostBinding('class.text-directive__info')
  get isParagraph() {
    return this.variant() === 'default';
  }

  @HostBinding('class.button-directive__cta')
  get isCTA() {
    return this.variant() === 'cta';
  }

  @HostBinding('class.text-directive__paragraph-bold')
  get isParagraphBold() {
    return this.variant() === 'cta';
  }
}
