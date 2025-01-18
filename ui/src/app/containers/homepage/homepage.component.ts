import { Component } from '@angular/core';
import { getRouterLink } from '../../shared/services/custom-routing/constants';
import { PATHS } from '../../app.routes';
import { TextDirective } from '../../shared/directives/text/text.directive';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-homepage',
  imports: [TextDirective, RouterLink, RouterLinkActive],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {}
