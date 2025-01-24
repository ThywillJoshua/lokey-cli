import {
  Component,
  computed,
  effect,
  HostListener,
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
import { LabelComponent } from '../../shared/components/label/label.component';
import { NotificationLabelDirective } from '../../shared/directives/notification-label/notification-label.directive';
import { PopoverLabelDirective } from '../../shared/directives/popover-label/popover-label.directive';
import { RouterLink } from '@angular/router';
import { PATHS } from '../../app.routes';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';
import { SortObjectPipe } from '../../shared/pipes/sortObject.pipe';
import { ConvertObjectIntoArrayPipe } from '../../shared/pipes/convertObjectIntoArray.pipe';
import { ModalComponent } from '../../shared/containers/modal/modal.component';
import { ButtonDirective } from '../../shared/directives/button/button.directive';

@Component({
  selector: 'app-translations',
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
  ],
  templateUrl: './translations.component.html',
  styleUrl: './translations.component.scss',
})
export class TranslationsComponent implements OnInit {
  PATHS = PATHS;

  fb = inject(FormBuilder);
  sortObjectPipe = inject(SortObjectPipe);
  filesService = inject(FilesService);

  sort = signal<'ASC' | 'DESC'>('ASC');
  keyOrValueNotFoundMessage = signal('');

  form = this.fb.group({
    searchInput: '',
    searchByKey: true,
    searchByValue: false,
  });

  searchInput = toSignal(this.form.get('searchInput')!.valueChanges);
  searchByKey = toSignal(this.form.get('searchByKey')!.valueChanges);
  searchByValue = toSignal(this.form.get('searchByValue')!.valueChanges);
  filteredData = signal<Record<string, any>>({});

  numberOfRowsPerPage = signal(10);
  pageNumber = signal(1);
  minRowsPerPage = signal(1);
  maxRowsPerPage = signal(100);

  paginatedData = computed(() => {
    const data = Object.entries(this.filteredData());
    const page = this.pageNumber();
    const rowsPerPage = this.numberOfRowsPerPage();

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return Object.fromEntries(data.slice(startIndex, endIndex));
  });

  totalPages = computed(() => {
    const totalRows = Object.keys(this.filteredData()).length;
    const rowsPerPage = this.numberOfRowsPerPage();
    return Math.ceil(totalRows / rowsPerPage);
  });

  selectedRowKeys = signal<string[]>([]);
  allRowsSelected = computed(
    () =>
      this.selectedRowKeys().length === Object.keys(this.filteredData()).length
  );

  showDeleteModal = signal(false);
  selectedForDeletion = signal<string[]>([]);

  files = computed(() => {
    const translations = this.filesService.translations() || {};
    return Object.keys(translations);
  });
  selectedFile = signal('');

  ENCODE_URI_COMPONENT = encodeURIComponent;

  constructor() {
    effect(() => {
      //Set selected file default
      if (!this.selectedFile()) {
        this.selectedFile.set(
          this.filesService.config()?.['default-file'] || ''
        );
      }
    });

    effect(() => {
      const translations = this.filesService.translations() || {};
      const data = Object.entries(
        translations[this.selectedFile() || ''] || {}
      );
      const searchInput = this.searchInput()?.toLowerCase() || '';
      const searchByKey =
        this.searchByKey() || this.form.get('searchByKey')?.getRawValue();

      const filterFn = ([key, value]: [string, any]) =>
        searchByKey
          ? key.toLowerCase().includes(searchInput)
          : String(value).toLowerCase().includes(searchInput);

      const filteredObject = Object.fromEntries(data.filter(filterFn));
      this.filteredData.set(
        new SortObjectPipe().transform(filteredObject, this.sort())
      );
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

  copy(value: string | object) {
    navigator.clipboard.writeText(JSON.stringify(value, null, 2)).then(
      () => console.log('Value copied:', value),
      (err) => console.error('Failed to copy value:', err)
    );
  }

  updateSelectedForDeletion(key: string) {
    this.showDeleteModal.set(true);

    if (!this.selectedRowKeys().find((k) => k === key)) {
      this.selectedRowKeys.set([]);
    }
    const updatedSelection = new Set(this.selectedRowKeys());
    updatedSelection.add(key);

    this.selectedForDeletion.set(Array.from(updatedSelection));
  }

  handleRowCheckboxChange(event: Event, key: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedRowKeys.update((keys) => [...keys, key]);
    } else {
      this.selectedRowKeys.update((keys) => keys.filter((k) => k !== key));
    }
  }

  handleAllRowsCheckboxChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedRowKeys.set(Object.keys(this.filteredData()));
    } else {
      this.selectedRowKeys.set([]);
    }
  }

  isSelected(key: string) {
    return this.selectedRowKeys().find((k) => k === key);
  }

  goToPreviousPage() {
    if (this.pageNumber() > 1) {
      this.pageNumber.update((page) => page - 1);
    }

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }

  goToNextPage() {
    const totalRows = Object.keys(this.filteredData()).length;
    const totalPages = Math.ceil(totalRows / this.numberOfRowsPerPage());

    if (this.pageNumber() < totalPages) {
      this.pageNumber.update((page) => page + 1);
    }

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }

  hasMorePages(): boolean {
    const totalRows = Object.keys(this.filteredData()).length;
    const totalPages = Math.ceil(totalRows / this.numberOfRowsPerPage());

    return this.pageNumber() < totalPages;
  }

  updateRowsPerPage(event: Event) {
    const newRowsPerPage = parseInt(
      (event.target as HTMLSelectElement).value,
      10
    );
    this.numberOfRowsPerPage.set(newRowsPerPage);
    this.pageNumber.set(1);
  }

  updatePageNumber(event: Event) {
    const newPageNumber = parseInt(
      (event.target as HTMLSelectElement).value,
      10
    );

    if (newPageNumber < 1) {
      (event.target as HTMLSelectElement).value = '1';
      this.pageNumber.set(1);
      return;
    } else if (newPageNumber > this.totalPages()) {
      (event.target as HTMLSelectElement).value = String(this.totalPages());
      this.pageNumber.set(this.totalPages());
      return;
    } else {
      this.pageNumber.set(newPageNumber);
    }
  }

  updateSelectedFile(event: Event) {
    const selectedFile = (event.target as HTMLSelectElement).value;
    this.selectedFile.set(selectedFile);
  }

  deleteSelectedKeys() {
    this.filesService
      .deleteKeyValuePairFromAllFiles(this.selectedForDeletion())
      .subscribe();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.goToPreviousPage();
    }
    if (event.key === 'ArrowRight') {
      this.goToNextPage();
    }
  }
}
