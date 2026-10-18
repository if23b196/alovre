import {Component, inject, signal, computed} from '@angular/core';
import {Router} from '@angular/router';
import {form, FormField, required, minLength} from '@angular/forms/signals';
import {TranslocoDirective, TranslocoService} from '@jsverse/transloco';

// Material Imports
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {ContentApi} from '../../core/services/content-api';
import {Notification} from '../../core/services/notification';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    FormField,
    TranslocoDirective,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './upload.html',
  styleUrl: './upload.scss',
})
export class Upload {
  // Dependency injection for API, notifications, translation, and routing
  private contentApi = inject(ContentApi);
  private notification = inject(Notification);
  private transloco = inject(TranslocoService);
  private router = inject(Router);

  // Define the raw input model as an Angular signal
  uploadModel = signal({
    title: '',
    language: 'English',
    text: '',
  });

  // Initialize modern Signal Form with validation rules
  uploadForm = form(this.uploadModel, (schema) => {
    required(schema.title);
    minLength(schema.title, 2);
  });

  // UI state signals for file handling and network loading
  selectedFile = signal<File | null>(null);
  isUploading = signal(false);
  isDragOver = signal(false);

  // Supported content languages with backend values and Transloco label keys
  languages = [
    { value: 'English', labelKey: 'languages.english' },
    { value: 'Spanish', labelKey: 'languages.spanish' },
    { value: 'German', labelKey: 'languages.german' },
    { value: 'French', labelKey: 'languages.french' },
    { value: 'Italian', labelKey: 'languages.italian' },
    { value: 'Portuguese', labelKey: 'languages.portuguese' },
    { value: 'Turkish', labelKey: 'languages.turkish' },
  ];

  // Computed state determining if the document tab submission is valid
  isDocValid = computed(() => {
    return this.uploadForm.title().valid() && this.selectedFile() !== null;
  });

  // Computed state determining if the plain text tab submission is valid
  isTextValid = computed(() => {
    return this.uploadForm.title().valid() && !!this.uploadForm.text().value().trim();
  });

  // Handle standard file input selection change
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.validateAndSetFile(input.files[0]);
    }
  }

  // Handle file drop event into the dropzone area
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    if (event.dataTransfer?.files.length) {
      this.validateAndSetFile(event.dataTransfer.files[0]);
    }
  }

  // Visual feedback when dragging a file over the dropzone
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  // Remove visual drag-over highlight when leaving dropzone
  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  // Clear the currently attached file preview
  removeFile(): void {
    this.selectedFile.set(null);
  }

  // Validate that the dropped/selected file is either PDF or TXT
  private validateAndSetFile(file: File): void {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isTxt = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');

    if (isPdf || isTxt) {
      this.selectedFile.set(file);
    } else {
      this.notification.show(this.transloco.translate('upload.onlyPdfTxt'), true);
    }
  }

  // Execute document upload via API service
  uploadDocument(): void {
    if (!this.isDocValid() || this.isUploading()) return;

    const {title, language} = this.uploadForm().value();
    const file = this.selectedFile()!;

    this.isUploading.set(true);
    this.contentApi.uploadDocument(title, language, file).subscribe({
      next: () => {
        this.notification.show(this.transloco.translate('upload.uploadSuccess'));
        void this.router.navigate(['/library']);
      },
      error: () => this.isUploading.set(false),
    });
  }

  // Execute plain text upload via API service
  uploadText(): void {
    if (!this.isTextValid() || this.isUploading()) return;

    const {title, language, text} = this.uploadForm().value();

    this.isUploading.set(true);
    this.contentApi.uploadText({title, language, text}).subscribe({
      next: () => {
        this.notification.show(this.transloco.translate('upload.uploadSuccess'));
        void this.router.navigate(['/library']);
      },
      error: () => this.isUploading.set(false),
    });
  }
}
