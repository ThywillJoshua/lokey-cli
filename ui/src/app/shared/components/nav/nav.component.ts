import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PATHS } from '../../../app.routes';
import { TextDirective } from '../../directives/text/text.directive';
import { ButtonDirective } from '../../directives/button/button.directive';
import { ModalComponent } from '../../containers/modal/modal.component';
import { SettingsComponent } from '../settings/settings.component';
import { FilesService } from '../../services/files/files.service';
import { CreateKeyValueComponent } from '../create-key-value/create-key-value.component';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [
    RouterLink,
    TextDirective,
    ButtonDirective,
    ModalComponent,
    SettingsComponent,
    CreateKeyValueComponent,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  PATHS = PATHS;

  fileservice = inject(FilesService);

  showCreateKeyValueModal = signal(true);
  showSettingsModal = signal(false);
}
