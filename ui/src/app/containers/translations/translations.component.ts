import { Component } from '@angular/core';
import { TextDirective } from '../../shared/directives/text/text.directive';

@Component({
  selector: 'app-translations',
  standalone: true,
  imports: [TextDirective],
  templateUrl: './translations.component.html',
  styleUrl: './translations.component.scss',
})
export class TranslationsComponent {}
