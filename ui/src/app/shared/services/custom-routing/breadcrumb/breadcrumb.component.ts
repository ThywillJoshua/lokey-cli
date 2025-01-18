import { Component, inject } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { getRouterLink } from '../constants';

@Component({
  standalone: true,
  selector: 'app-breadcrumb',
  imports: [RouterLink, RouterLinkActive],
  template: `
    @for(crumb of breadcrumbService.breadcrumbs(); track $index; let idx =
    $index){
    <nav>
      <ul class="breadcrumb">
        <li>
          <a
            [routerLink]="[getBreadcrumbLink(idx)]"
            routerLinkActive="active"
            ariaCurrentWhenActive="page"
            >{{ crumb }}</a
          >
          @if(!isLastBreadcrumb(idx)) {
          <span>/</span>
          }
        </li>
      </ul>
    </nav>
    }
  `,
  styles: [
    `
      :host {
        display: flex;
      }
      .breadcrumb {
        list-style: none;
        display: flex;
        padding: 0;
        margin: 0;
      }

      .breadcrumb li span {
        text-decoration: unset;
        cursor: pointer;
      }

      .breadcrumb li span:last-child {
        margin: 0 4px;
      }
    `,
  ],
})
export class BreadcrumbComponent {
  breadcrumbService = inject(BreadcrumbService);

  getBreadcrumbLink(idx: number): object | string {
    const path = this.breadcrumbService
      .breadcrumbs()
      .slice(0, idx + 1)
      .join('/');
    return getRouterLink(path);
  }

  isLastBreadcrumb(idx: number): boolean {
    return idx === this.breadcrumbService.breadcrumbs().length - 1;
  }
}
