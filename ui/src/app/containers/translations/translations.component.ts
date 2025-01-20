import { Component, inject, OnInit, signal } from '@angular/core';
import { TextDirective } from '../../shared/directives/text/text.directive';
import { CheckboxDirective } from '../../shared/directives/checkbox/checkbox.directive';
import { TextInputDirective } from '../../shared/directives/text-input/text-input.directive';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-translations',
  standalone: true,
  imports: [
    TextDirective,
    CheckboxDirective,
    TextInputDirective,
    ReactiveFormsModule,
    JsonPipe,
  ],
  templateUrl: './translations.component.html',
  styleUrl: './translations.component.scss',
})
export class TranslationsComponent implements OnInit {
  fb = inject(FormBuilder);
  sort = signal<'ASC' | 'DESC'>('ASC');
  keyOrValueNotFoundMessage = signal('');

  form = this.fb.group({
    searchInput: '',
    searchByKey: true,
    searchByValue: false,
  });

  ngOnInit(): void {
    this.handleSearchByKeyOrValueFormChanges();
  }

  handleSearchByKeyOrValueFormChanges() {
    this.form
      .get('searchByKey')
      ?.valueChanges.pipe(
        map((v) => {
          if (v) {
            this.form.get('searchByValue')?.patchValue(false);
          } else {
            if (this.form.get('searchByValue')?.getRawValue() === false) {
              this.form.get('searchByValue')?.patchValue(true);
            }
          }
        })
      )
      .subscribe();

    this.form
      .get('searchByValue')
      ?.valueChanges.pipe(
        map((v) => {
          if (v) {
            this.form.get('searchByKey')?.patchValue(false);
          } else {
            if (this.form.get('searchByKey')?.getRawValue() === false) {
              this.form.get('searchByKey')?.patchValue(true);
            }
          }
        })
      )
      .subscribe();
  }
}
