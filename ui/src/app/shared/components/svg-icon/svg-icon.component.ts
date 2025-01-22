import { Component, input } from '@angular/core';

type IIconName =
  | 'trash'
  | 'copy'
  | 'sort_a-z'
  | 'sort_z-a'
  | 'arrow-solid-left'
  | 'arrow-solid-right';

@Component({
  selector: 'app-svg-icon',
  imports: [],
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.scss',
})
export class SvgIconComponent {
  iconName = input<IIconName>('copy');
}
