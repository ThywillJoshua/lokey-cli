import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '../translate/services/translate.service';

export const SUPPORTED_LANGUAGES = [
  { key: 'LANGUAGES.ENGLISH', value: 'en' },
  { key: 'LANGUAGES.GERMAN', value: 'de' },
];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  currentLanguage = signal('en');
  translateService = inject(TranslateService);

  changeLanguage(lang: string) {
    this.translateService.updateUrl(`assets/i18n/${lang}.json`);
  }
}
