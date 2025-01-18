import { Injectable, WritableSignal } from '@angular/core';
import { DEFAULT_THEME } from './constants';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  applyTheme(theme: WritableSignal<typeof DEFAULT_THEME>): void {
    if (typeof document === 'undefined') return;

    // Perform a deep merge of the provided theme with the default theme
    const mergedTheme = this.deepMerge(DEFAULT_THEME, theme());

    // Update the signal with the merged theme
    theme.set(mergedTheme);

    // Apply theme properties to CSS variables
    this.setCssVariables(mergedTheme);
  }

  private deepMerge(target: any, source: any): any {
    const output = { ...target };
    for (const key of Object.keys(source)) {
      if (
        Object.prototype.toString.call(source[key]) === '[object Object]' &&
        key in target
      ) {
        // Recursively merge objects
        output[key] = this.deepMerge(target[key], source[key]);
      } else {
        // Assign values directly
        output[key] = source[key];
      }
    }
    return output;
  }

  private setCssVariables(theme: typeof DEFAULT_THEME): void {
    Object.entries(theme).forEach(([groupKey, groupValue]) => {
      if (typeof groupValue === 'object' && groupValue !== null) {
        Object.entries(groupValue).forEach(([key, value]) => {
          const cssVariable = `--echo-theme-${groupKey}-${key}`;
          document.documentElement.style.setProperty(cssVariable, value);
        });
      }
    });
  }
}
