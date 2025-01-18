import {
  Injectable,
  PLATFORM_ID,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Observable, filter, from, take, tap } from 'rxjs';
import { ITranslateConfig } from '../models/translate.models';
import {
  getTranslation,
  keyNotFoundError,
  replacePlaceholders,
} from '../utils/translate.utils';
import { toObservable } from '@angular/core/rxjs-interop';
import { MockTranslateService } from './mockTranslateService';
import { isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  static _url: WritableSignal<string>;
  private translations = signal<Record<string, any> | null>(null);
  platformId = inject(PLATFORM_ID);

  constructor() {
    //updateTranslations when url changes
    effect(() => {
      if (isPlatformServer(this.platformId)) {
        return;
      }
      this.getTranslations(TranslateService._url())
        .pipe(
          take(1),
          tap((t) => this.translations.set(t))
        )
        .subscribe();
    });
  }

  updateUrl(url: string) {
    TranslateService._url.set(url);
  }

  private getTranslations(url: string) {
    return from(
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .catch((err) => {
          console.error(err.message);
          return null;
        })
    );
  }

  private getData(key: string, values?: Record<string, any>): Signal<string> {
    return computed(() => {
      if (!this.translations()) {
        return '';
      }

      if (!key) {
        return '';
      }

      //getTranslation
      const keys = key.split('.');
      const { translation, found } = getTranslation(this.translations(), keys);
      if (!found) {
        console.warn(keyNotFoundError(key, TranslateService._url()));
        return key;
      }

      //replace Values
      const hasReplacementValues = values && Object.keys(values).length > 0;
      if (hasReplacementValues) {
        return replacePlaceholders(translation, values);
      }

      return translation;
    });
  }

  translate(key: string, values?: Record<string, any>): string {
    return this.getData(key, values)();
  }

  translate$(key: string, values?: Record<string, any>): Observable<string> {
    return toObservable(this.getData(key, values)).pipe(filter(Boolean));
  }
}

export function provideTranslate(config: ITranslateConfig) {
  TranslateService._url = signal(config.initialUrl);
  return TranslateService;
}

export function provideTranslateTestModule() {
  return { provide: TranslateService, useClass: MockTranslateService };
}
