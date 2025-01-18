import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { map } from 'rxjs';

type IFiles = {
  file: string;
  content: Record<string, any>;
  parsedContent?: Record<string, any>;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);

  ngOnInit(): void {
    this.http
      .get<IFiles[]>('/files/')
      .pipe(map((files) => files.map((file) => this.addParsedContent(file))))
      .subscribe(console.log);

    this.http.get('/config/').subscribe(console.log);
  }

  addParsedContent(files: IFiles): IFiles {
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
