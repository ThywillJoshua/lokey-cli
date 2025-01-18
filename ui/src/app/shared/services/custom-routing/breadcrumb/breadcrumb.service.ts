import { Injectable, signal } from '@angular/core';
import { ROUTER_NAME } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  breadcrumbs = signal<string[]>(['home']);

  getPathFromSegment(segment: string): string {
    const dynamicRegex = new RegExp(`\\(${ROUTER_NAME}:([^\\)]+)\\)`);
    const match = segment.match(dynamicRegex);
    return match ? match[1] : segment;
  }

  updateBreadcrumbs(path: string): void {
    // console.log(`Updating breadcrumbs for path: ${path}`);
    const newPath = this.getPathFromSegment(path);

    if (newPath) {
      this.breadcrumbs.set(newPath.split('/'));
    }
  }

  clearBreadcrumbs(): void {
    this.breadcrumbs.set([]);
  }
}
