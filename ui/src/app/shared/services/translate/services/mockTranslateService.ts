import { Injectable, Signal, computed, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockTranslateService {
  static url: Signal<string>;
  static country: Signal<string>;
  private translations = signal<Record<string, any> | null>(null);

  constructor() {
    MockTranslateService.url = signal('mock-url');
    MockTranslateService.country = signal('mock-country');
  }

  // private getMockTranslations(url: string): Observable<Record<string, any> | null> {
  //   // Simulate HTTP request with mock data
  //   const mockTranslations = {
  //     greeting: 'Hello',
  //     farewell: 'Goodbye',
  //   };
  //   return of(mockTranslations);
  // }

  private getData(key: string, values?: Record<string, any>): Signal<string> {
    return computed(() => {
      if (!this.translations()) {
        return '';
      }

      if (!key) {
        return '';
      }

      // Mock getTranslation
      const translation = this.translations()?.[key];
      if (!translation) {
        console.warn(`Translation not found for key: ${key}`);
        return key;
      }

      // Mock replaceValues
      const hasReplacementValues = values && Object.keys(values).length > 0;
      if (hasReplacementValues) {
        let translatedText = translation;
        for (const [placeholder, value] of Object.entries(values)) {
          translatedText = translatedText.replace(`{{${placeholder}}}`, value);
        }
        return translatedText;
      }

      return translation;
    });
  }

  translate(key: string, values?: Record<string, any>): string {
    return this.getData(key, values)();
  }

  translate$(key: string, values?: Record<string, any>): Observable<string> {
    return of(this.translate(key, values));
  }
}
