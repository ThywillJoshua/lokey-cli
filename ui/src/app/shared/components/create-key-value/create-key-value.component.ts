import { Component, inject, signal } from '@angular/core';
import { TextDirective } from '../../directives/text/text.directive';
import { TextInputDirective } from '../../directives/text-input/text-input.directive';
import { ButtonDirective } from '../../directives/button/button.directive';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FilesService } from '../../services/files/files.service';

@Component({
  selector: 'app-create-key-value',
  imports: [
    TextDirective,
    TextInputDirective,
    ButtonDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './create-key-value.component.html',
  styleUrl: './create-key-value.component.scss',
})
export class CreateKeyValueComponent {
  fb = inject(FormBuilder);
  filesService = inject(FilesService);

  form = this.fb.group({
    key: '',
    value: '',
  });

  isCreatingKeyValue = signal(false);
  createKeyValue() {
    console.log(this.form.getRawValue());
  }
}
