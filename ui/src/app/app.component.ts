import { HttpClient } from '@angular/common/http';
import { Component, inject, model, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { NavComponent } from './shared/containers/nav/nav.component';
import { DEFAULT_THEME } from './shared/services/theme/constants';
import { ThemeService } from './shared/services/theme/theme.service';
import { FilesService } from './shared/services/files/files.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  theme = model<typeof DEFAULT_THEME>(DEFAULT_THEME);
  themeService = inject(ThemeService);
  filesService = inject(FilesService);

  ngOnInit(): void {
    this.themeService.applyTheme(this.theme);
    this.filesService.getTranslations();
    this.filesService.getConfig();
  }
}
