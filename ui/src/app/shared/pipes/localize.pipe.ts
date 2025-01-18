import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language/language.service';

@Pipe({ name: 'localize', pure: false, standalone: true })
export class LocalizePipe implements PipeTransform {
  private languageService = inject(LanguageService);
  currentLanguage = this.languageService.currentLanguage();

  transform(input: { key: string; value: string }[]): string {
    if (!input) {
      return 'No input provided';
    }

    return (
      input.find((obj) => obj.key === this.currentLanguage)?.value ||
      'Data not found'
    );
  }
}
