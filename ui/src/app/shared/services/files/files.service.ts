import { inject, Injectable, signal } from '@angular/core';
import { FilesAPIService } from './files-api.service';
import { first, tap } from 'rxjs';
import { IGetTranslation } from './files.model';

@Injectable({ providedIn: 'root' })
export class FilesService {
  translations = signal<Record<string, Record<string, string>> | null>(null);
  translationsJSON = signal<Record<string, Record<string, any>> | null>(null);
  config = signal<Record<string, string> | null>(null);

  filesAPIService = inject(FilesAPIService);

  translate(body: IGetTranslation) {
    return this.filesAPIService.translate(body).pipe(first());
  }

  getTranslations() {
    this.filesAPIService
      .getFiles()
      .pipe(
        first(),
        tap((data) =>
          //set translationsJSON
          data.forEach((d) => {
            this.translationsJSON.set({
              ...this.translationsJSON(),
              [d.fileName]: d.content,
            });
          })
        ),
        tap((data) =>
          //set translations
          data.forEach((d) => {
            d.parsedContent &&
              this.translations.set({
                ...this.translations(),
                [d.fileName]: d.parsedContent,
              });
          })
        )
      )
      .subscribe();
  }

  getConfig() {
    this.filesAPIService
      .getConfig()
      .pipe(
        first(),
        tap((d) => this.config.set(d))
      )
      .subscribe();
  }

  static sortObjectKeys(
    obj: Record<string, any>,
    order: 'ASC' | 'DESC' = 'ASC'
  ): Record<string, any> {
    // Sort the keys based on the provided order
    const sortedKeys = Object.keys(obj).sort((a, b) => {
      if (order === 'ASC') {
        return a.localeCompare(b); // Ascending order
      } else {
        return b.localeCompare(a); // Descending order
      }
    });

    // Create a new object with sorted keys
    const sortedObject: Record<string, any> = {};
    for (const key of sortedKeys) {
      sortedObject[key] = obj[key];
    }

    return sortedObject;
  }
}
