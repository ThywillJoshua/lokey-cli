import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TextDirective } from '../../shared/directives/text/text.directive';
import { CheckboxDirective } from '../../shared/directives/checkbox/checkbox.directive';
import { TextInputDirective } from '../../shared/directives/text-input/text-input.directive';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ConvertObjectIntoArrayPipe } from '../../shared/pipes/convertObjectIntoArray.pipe';
import { LabelComponent } from '../../shared/components/label/label.component';
import { NotificationLabelDirective } from '../../shared/directives/notification-label/notification-label.directive';
import { PopoverLabelDirective } from '../../shared/directives/popover-label/popover-label.directive';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';
import { ModalComponent } from '../../shared/containers/modal/modal.component';
import { ButtonDirective } from '../../shared/directives/button/button.directive';
import { UpperCasePipe } from '@angular/common';
import { FilesService } from '../../shared/services/files/files.service';
import { tap } from 'rxjs';
import { PATHS } from '../../app.routes';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-translate',
  standalone: true,
  imports: [
    TextDirective,
    CheckboxDirective,
    TextInputDirective,
    ReactiveFormsModule,
    ConvertObjectIntoArrayPipe,
    LabelComponent,
    NotificationLabelDirective,
    PopoverLabelDirective,
    RouterLink,
    SvgIconComponent,
    ModalComponent,
    ButtonDirective,
    UpperCasePipe,
  ],
  templateUrl: './translate.component.html',
  styleUrl: './translate.component.scss',
})
export class TranslateComponent {
  filesService = inject(FilesService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);

  key = signal(
    decodeURIComponent(this.route.snapshot.paramMap.get('id') || '')
  );

  form = this.fb.group({});
  loading = signal(true);

  defaultFile = computed(
    () => this.filesService.config()?.['default-file'] || ''
  );

  files = computed(() => {
    const translations = this.filesService.translations() || {};
    return Object.keys(translations);
  });

  filesExcludingDefault = computed(() => {
    const translations = this.filesService.translations() || {};
    return Object.keys(translations).filter((f) => f !== this.defaultFile());
  });

  fileSelectorForm = this.fb.group({
    file: '',
  });

  showDeleteModal = signal(false);

  get selectedFileName() {
    return this.fileSelectorForm.get('file')?.getRawValue();
  }

  formSignal = toSignal(this.form.valueChanges);

  defaultFileState = computed(() => {
    if (this.loading()) {
      return '';
    }
    this.form.valueChanges;

    const defaultFileControl = (this.form.controls as any)[
      this.defaultFile() || ''
    ];
    this.formSignal();
    const originalValue =
      this.filesService.translations()?.[this.defaultFile()]?.[this.key()];

    if (
      defaultFileControl?.dirty &&
      (this.form.getRawValue() as any)?.[this.defaultFile()] === originalValue
    ) {
      return 'updated';
    } else if (
      defaultFileControl?.dirty &&
      (this.form.getRawValue() as any)?.[this.defaultFile()] !== originalValue
    ) {
      return 'changed';
    }

    return 'current';
  });

  selectedFileState = computed(() => {
    if (this.loading()) {
      return '';
    }

    const selectedFileControl = (this.form.controls as any)[
      this.selectedFileName || ''
    ];
    this.formSignal();
    const originalValue =
      this.filesService.translations()?.[this.selectedFileName]?.[this.key()];
    if (
      selectedFileControl?.dirty &&
      (this.form.getRawValue() as any)?.[this.selectedFileName] ===
        originalValue
    ) {
      return 'updated';
    } else if (
      selectedFileControl?.dirty &&
      (this.form.getRawValue() as any)?.[this.selectedFileName] !==
        originalValue
    ) {
      return 'changed';
    }

    return 'current';
  });

  constructor() {
    effect(() => {
      const files = this.filesService.translations();

      if (files && this.defaultFile()) {
        Object.entries(files).forEach((file) => {
          this.form.addControl(file[0], new FormControl(file[1][this.key()]));
        });

        //set default file for selector
        const filename = Object.keys(files)
          .filter((filename) => filename !== this.defaultFile())
          .find((filename) => typeof filename === 'string');

        if (filename) {
          this.fileSelectorForm.get('file')?.patchValue(filename);
        }

        this.loading.set(false);
      }
    });
  }

  undoChange(filename: string) {
    const control = (this.form.controls as any)[filename];
    const originalValue =
      this.filesService.translations()?.[filename]?.[this.key()];

    control.patchValue(originalValue);
    control.markAsPristine();
  }

  confirmChange(filename: string) {
    const newValue = (this.form.controls as any)[filename]?.getRawValue();
    this.filesService
      .updateValue({ filename, key: this.key(), newValue })
      .pipe(
        tap(() => {
          this.filesService.translations.update((translations) => {
            if (!translations || !translations[filename]) {
              console.warn(`Filename "${filename}" not found in translations.`);
              return translations;
            }
            if (!translations[filename][this.key()]) {
              console.warn(
                `Key "${this.key()}" not found in filename "${filename}".`
              );
            }
            return {
              ...translations,
              [filename]: {
                ...translations[filename],
                [this.key()]: newValue,
              },
            };
          });
        })
      )
      .subscribe(() => {
        console.log(this.filesService.translations());
      });
  }

  updateKey(filename: string, newKey: string) {
    this.filesService
      .updateKey({ filename, newKey, prevKey: this.key() })
      .subscribe();
  }

  deleteSelectedKey() {
    this.filesService
      .deleteKeyValuePairFromAllFiles([this.key()])
      .pipe(
        tap(() => {
          this.router.navigate([PATHS.TRANSLATIONS]);
        })
      )
      .subscribe();
  }
}
