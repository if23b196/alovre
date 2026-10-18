import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ContentApi } from '../../core/services/content-api';
import { Notification } from '../../core/services/notification';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    ReactiveFormsModule,
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
  private fb = inject(FormBuilder);
  private contentApi = inject(ContentApi);
  private notification = inject(Notification);
  private transloco = inject(TranslocoService);
  private router = inject(Router);

  // Reactive Form handling all inputs cleanly
  uploadForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    language: ['English', Validators.required],
    text: [''],
  });

  // Signals for file management and async loading state
  selectedFile = signal<File | null>(null);
  isUploading = signal(false);
  isDragOver = signal(false);

  languages = [
    'English',
    'Spanish',
    'German',
    'French',
    'Italian',
    'Portuguese',
    'Turkish',
  ];

  // --- Computed Signals for Robust Button Validation ---
  isTitleValid = computed(() => {
    const ctrl = this.uploadForm.get('title');
    return !!ctrl?.valid && !!ctrl?.value?.trim();
  });

  isDocValid = computed(() => this.isTitleValid() && this.selectedFile() !== null);

  isTextValid = computed(() => {
    const textVal = this.uploadForm.get('text')?.value;
    return this.isTitleValid() && !!textVal?.trim();
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.validateAndSetFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    if (event.dataTransfer?.files.length) {
      this.validateAndSetFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  removeFile(): void {
    this.selectedFile.set(null);
  }

  private validateAndSetFile(file: File): void {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isTxt = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');

    if (isPdf || isTxt) {
      this.selectedFile.set(file);
    } else {
      this.notification.show(this.transloco.translate('upload.onlyPdfTxt'), true);
    }
  }

  uploadDocument(): void {
    if (!this.isDocValid() || this.isUploading()) return;

    const { title, language } = this.uploadForm.value;
    const file = this.selectedFile()!;

    this.isUploading.set(true);
    this.contentApi.uploadDocument(title, language, file).subscribe({
      next: () => {
        this.notification.show(this.transloco.translate('upload.uploadSuccess'));
        this.router.navigate(['/library']);
      },
      error: () => this.isUploading.set(false),
    });
  }

  uploadText(): void {
    if (!this.isTextValid() || this.isUploading()) return;

    const { title, language, text } = this.uploadForm.value;

    this.isUploading.set(true);
    this.contentApi.uploadText({ title, language, text }).subscribe({
      next: () => {
        this.notification.show(this.transloco.translate('upload.uploadSuccess'));
        this.router.navigate(['/library']);
      },
      error: () => this.isUploading.set(false),
    });
  }
}
