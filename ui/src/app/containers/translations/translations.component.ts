import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TextDirective } from '../../shared/directives/text/text.directive';
import { CheckboxDirective } from '../../shared/directives/checkbox/checkbox.directive';
import { TextInputDirective } from '../../shared/directives/text-input/text-input.directive';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { FilesService } from '../../shared/services/files/files.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SortKeyValueIntoArrayPipe } from '../../shared/pipes/sortKeyValueIntoArray.pipe';
import { LabelComponent } from '../../shared/components/label/label.component';

@Component({
  selector: 'app-translations',
  standalone: true,
  imports: [
    TextDirective,
    CheckboxDirective,
    TextInputDirective,
    ReactiveFormsModule,
    SortKeyValueIntoArrayPipe,
    LabelComponent,
  ],
  templateUrl: './translations.component.html',
  styleUrl: './translations.component.scss',
})
export class TranslationsComponent implements OnInit {
  fb = inject(FormBuilder);
  sort = signal<'ASC' | 'DESC'>('ASC');
  keyOrValueNotFoundMessage = signal('');
  filesService = inject(FilesService);

  form = this.fb.group({
    searchInput: '',
    searchByKey: true,
    searchByValue: false,
  });

  searchInput = toSignal(this.form.get('searchInput')!.valueChanges);
  searchByKey = toSignal(this.form.get('searchByKey')!.valueChanges);
  searchByValue = toSignal(this.form.get('searchByValue')!.valueChanges);
  filteredData = signal<Record<string, any>>({});

  constructor() {
    effect(() => {
      const translations = this.filesService.translations() || {};
      const defaultFile = this.filesService.config()?.['default-file'] || '';
      const data = Object.entries(translations[defaultFile] || {});
      const searchInput = this.searchInput()?.toLowerCase() || '';
      const searchByKey =
        this.searchByKey() || this.form.get('searchByKey')?.getRawValue();

      const filterFn = ([key, value]: [string, any]) =>
        searchByKey
          ? key.toLowerCase().includes(searchInput)
          : String(value).toLowerCase().includes(searchInput);

      const filteredObject = Object.fromEntries(data.filter(filterFn));
      this.filteredData.set(filteredObject);
    });
  }

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

  copy(value: string) {
    navigator.clipboard.writeText(value).then(
      () => console.log('Value copied:', value),
      (err) => console.error('Failed to copy value:', err)
    );
  }
}
