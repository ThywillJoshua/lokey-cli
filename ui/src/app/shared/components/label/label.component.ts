import { Component, input } from '@angular/core';
import { TextDirective } from '../../directives/text/text.directive';

@Component({
  selector: 'app-label',
  imports: [TextDirective],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss',
})
export class LabelComponent {
  status = input<'current' | 'changed' | 'updated' | 'error'>('current');
}
