import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  IFiles,
  IGenerateTranslationsRequest,
  IGetTranslation,
  IUpdateKey,
  IUpdateValue,
} from './files.model';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FilesAPIService {
  http = inject(HttpClient);

  getConfig() {
    return this.http.get<Record<string, string>>('/config/');
  }

  getFiles() {
    return this.http
      .get<IFiles[]>('/files/')
      .pipe(map((files) => files.map((file) => this.addParsedContent(file))));
  }

  translate(body: IGetTranslation) {
    return this.http.post('/translate/', body);
  }

  deleteKeyValuePairFromAllFiles(keys: string[]) {
    return this.http.put('/deleteKeys/', { keys });
  }

  updateValue(body: IUpdateValue) {
    return this.http.put('/updateValue/', body);
  }

  updateKey(body: IUpdateKey) {
    return this.http.put('/updateKey/', body);
  }

  generateAITranslation(body: IGenerateTranslationsRequest) {
    return this.http.post('/generateAITranslation/', body);
  }

  private addParsedContent(files: IFiles): IFiles {
    const flattenObject = (
      obj: Record<string, any>,
      parentKey = ''
    ): Record<string, string> => {
      const result: Record<string, string> = {};

      for (const [key, value] of Object.entries(obj)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof value === 'object' && value !== null) {
          Object.assign(result, flattenObject(value, newKey));
        } else {
          result[newKey] = value as string;
        }
      }

      return result;
    };

    files.parsedContent = flattenObject(files.content);
    return files;
  }
}
