import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PATHS } from '../../../app.routes';
import { TextDirective } from '../../directives/text/text.directive';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [RouterLink, TextDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  PATHS = PATHS;
}
