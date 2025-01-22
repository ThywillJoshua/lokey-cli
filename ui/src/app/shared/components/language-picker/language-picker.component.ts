import { Component, inject, signal } from '@angular/core';
import {
  LanguageService,
  SUPPORTED_LANGUAGES,
} from '../../services/language/language.service';
import { TranslatePipe } from '../../services/translate/pipes/translate.pipe';

@Component({
  standalone: true,
  selector: 'app-language-picker',
  imports: [TranslatePipe],
  templateUrl: './language-picker.component.html',
  styleUrl: './language-picker.component.scss',
})
export class LanguagePickerComponent {
  languageService = inject(LanguageService);
  languages = signal(SUPPORTED_LANGUAGES);

  changeLanguage(event: Event) {
    const language = (event.target as HTMLSelectElement).value;
    this.languageService.changeLanguage(language);
  }
}
