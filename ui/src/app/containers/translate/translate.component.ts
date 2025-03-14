import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TextDirective } from '../../shared/directives/text/text.directive';
import { TextInputDirective } from '../../shared/directives/text-input/text-input.directive';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from '../../shared/components/label/label.component';
import { NotificationLabelDirective } from '../../shared/directives/notification-label/notification-label.directive';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';
import { ModalComponent } from '../../shared/containers/modal/modal.component';
import { ButtonDirective } from '../../shared/directives/button/button.directive';
import { FilesService } from '../../shared/services/files/files.service';
import { finalize, tap } from 'rxjs';
import { PATHS } from '../../app.routes';
import { toSignal } from '@angular/core/rxjs-interop';

interface FormSignalType {
  [key: string]: any; // Replace `any` with a specific type if possible
}

@Component({
  selector: 'app-translate',
  standalone: true,
  imports: [
    TextDirective,
    TextInputDirective,
    ReactiveFormsModule,
    LabelComponent,
    NotificationLabelDirective,
    SvgIconComponent,
    ModalComponent,
    ButtonDirective,
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

  formSignal = toSignal<Partial<FormSignalType> | undefined>(
    this.form.valueChanges
  );

  showAITranslationInput = signal(true);

  get selectedFileName() {
    return this.fileSelectorForm.get('file')?.getRawValue();
  }

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

      if (files && this.defaultFile() && this.loading()) {
        Object.entries(files).forEach((file) => {
          this.form.addControl(file[0], new FormControl(file[1][this.key()]));
          this.form.addControl(file[0] + 'ai', new FormControl(''));
        });

        //set default file for selector
        const filename = Object.keys(files)
          .filter((filename) => filename !== this.defaultFile())
          .sort()
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

  confirmChange(filename: string, newValue?: string) {
    if (!newValue)
      newValue = (this.form.controls as any)[filename]?.getRawValue();

    if (!newValue) return;

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
      .subscribe();
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

  isGenerationAITranslation = signal(false);
  generateAITranslation(filename: string) {
    const from =
      this.filesService.translations()?.[this.defaultFile()][
        '_lokey_metadata.language'
      ];
    const to =
      this.filesService.translations()?.[filename]['_lokey_metadata.language'];

    if (
      !this.formSignal()?.[this.defaultFile()] ||
      !this.key() ||
      !to ||
      !from
    ) {
      return;
    }

    this.isGenerationAITranslation.set(true);
    this.filesService
      .generateAITranslation({
        requests: [
          {
            from,
            to,
            keyValues: {
              [this.key()]: this.formSignal()?.[this.defaultFile()],
            },
          },
        ],
      })
      .pipe(
        tap((res) => {
          (this.form.controls as any)[filename + 'ai']?.patchValue(
            res.responses?.[0]?.translatedKeyValues?.[this.key()]
          );
        }),
        finalize(() => this.isGenerationAITranslation.set(false))
      )
      .subscribe();
  }

  applyAITranslation(filename: string) {
    const aiValue = this.formSignal()?.[filename + 'ai'];
    (this.form.controls as any)[filename].patchValue(aiValue);
    this.confirmChange(filename, aiValue);
  }

  generateAITranslationForAll() {
    this.filesService.generateAITranslation({
      requests: this.filesExcludingDefault().map((filename) => ({
        from: this.defaultFile(),
        to: filename,
        keyValues: {
          [this.key()]: this.formSignal()?.[this.defaultFile()],
        },
      })),
    });
  }
}
