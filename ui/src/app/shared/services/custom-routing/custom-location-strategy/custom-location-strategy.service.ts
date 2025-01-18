import { inject, Injectable } from '@angular/core';
import { HashLocationStrategy } from '@angular/common';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.service';

@Injectable({
  providedIn: 'root',
})
export class CustomLocationStrategy extends HashLocationStrategy {
  breadcrumbService = inject(BreadcrumbService);

  // Returns the current path
  override path(includeHash: boolean = false): string {
    // console.log('Current path requested');
    return '';
  }

  // Prepares the internal URL to be external if needed
  override prepareExternalUrl(internal: string): string {
    // console.log(`Preparing external URL: ${internal}`);
    return internal;
  }

  // Handles push state navigation without altering the browser's address bar
  override pushState(
    state: any,
    title: string,
    url: string,
    queryParams: string
  ): void {
    this.breadcrumbService.updateBreadcrumbs(url);
    // console.log(`Navigation inside custom element: ${url}`);
  }

  // Handles replacing the current state without altering the browser's address bar
  override replaceState(
    state: any,
    title: string,
    url: string,
    queryParams: string
  ): void {
    // console.log(`Replacing state inside custom element: ${url}`);
  }

  // No-op for forward navigation
  override forward(): void {
    // console.log('Forward navigation triggered');
  }

  // No-op for back navigation
  override back(): void {
    // console.log('Back navigation triggered');
  }

  // Returns the current state
  override getState(): any {
    // console.log('Getting current state');
    return null;
  }

  // No-op for pop state events
  override onPopState(fn: (event: any) => void): void {
    // console.log('Pop state triggered');
  }

  // Returns the base href
  override getBaseHref(): string {
    // console.log('Getting base href');
    return '';
  }
}
