import { Component, OnInit } from '@angular/core';
import { inject, signal } from '@angular/core';
import { DEFAULT_THEME } from '../../src/app/shared/services/theme/constants';
import { ThemeService } from '../../src/app/shared/services/theme/theme.service';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-global',
  template: '<ng-content></ng-content>',
})
export class GlobalComponent implements OnInit {
  theme = signal(DEFAULT_THEME);
  themeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.applyTheme(this.theme);
  }
}
