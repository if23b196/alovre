import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription, timer, switchMap, catchError, EMPTY } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ContentApi, ContentItem } from '../../core/services/content-api';
import { Notification } from '../../core/services/notification';
import { ActionDialog, ActionDialogData } from './action-dialog/action-dialog';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoDirective,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export class Library implements OnInit, OnDestroy {
  // Dependency injection for API, dialogs, router, and notifications
  private contentApi = inject(ContentApi);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private notification = inject(Notification);
  private transloco = inject(TranslocoService);

  // State signals with hardcoded mock examples for immediate testing
  allItems = signal<ContentItem[]>([
    {
      id: 'mock-1',
      title: 'Introduction to Angular Signals',
      type: 'PDF',
      language: 'English',
      uploadTimestamp: [2026, 6, 10],
      fileSize: 1048576, // 1.0 MB
      ocrProcessed: true,
    },
    {
      id: 'mock-2',
      title: 'Quick Spring Boot Notes',
      type: 'TEXT',
      language: 'English',
      uploadTimestamp: [2026, 6, 12],
      fileSize: 2048, // 2 KB
      ocrProcessed: true,
    },
    {
      id: 'mock-3',
      title: 'Scanned Document (OCR Processing)',
      type: 'TXT',
      language: 'German',
      uploadTimestamp: [2026, 6, 18],
      fileSize: 5242880, // 5.0 MB
      ocrProcessed: false, // Tests processing spinner & disabled interactions
    },
  ]);

  searchQuery = signal('');

  // RxJS subscription manager for background polling
  private pollSub?: Subscription;

  // Computed state for live, instantaneous search filtering
  filteredItems = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.allItems();
    return this.allItems().filter((item) => item.title.toLowerCase().includes(query));
  });

  // Computed item count label formatting based on length
  itemCountLabel = computed(() => {
    const count = this.allItems().length;
    if (count === 1) return this.transloco.translate('library.itemCount_one');
    return this.transloco.translate('library.itemCount_other', { count });
  });

  ngOnInit(): void {
    // Poll backend for updates (note: if backend is connected, this will overwrite mocks with real data)
    this.pollSub = timer(0, 60000)
      .pipe(
        switchMap(() =>
          this.contentApi.getLibraryItems().pipe(
            catchError(() => EMPTY) // Falls back gracefully to mock data if backend isn't running
          )
        )
      )
      .subscribe((items) => {
        // Only override if backend actually returns data, keeping mocks if backend is empty/offline
        if (items && items.length > 0) {
          this.allItems.set(items);
        }
      });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  // Navigate to reader page if content processing is complete
  openDocument(item: ContentItem): void {
    if (!item.ocrProcessed) return;
    void this.router.navigate(['/reader', item.id]);
  }

  // Open modern Material Dialog to rename document
  openEditDialog(event: Event, item: ContentItem): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ActionDialog, {
      width: '400px',
      data: {
        mode: 'edit',
        title: this.transloco.translate('library.editModalTitle'),
        initialValue: item.title,
        placeholder: this.transloco.translate('library.editModalPlaceholder'),
        confirmText: this.transloco.translate('library.btnSave'),
        confirmColor: 'primary',
      } as ActionDialogData,
    });

    dialogRef.afterClosed().subscribe((newTitle?: string) => {
      if (newTitle && newTitle !== item.title) {
        // If it's a mock item, update it locally; otherwise call API
        if (item.id.startsWith('mock-')) {
          this.allItems.update((items) =>
            items.map((i) => (i.id === item.id ? { ...i, title: newTitle } : i))
          );
          this.notification.show(this.transloco.translate('library.updateSuccess'));
        } else {
          this.contentApi.updateContentTitle(item.id, newTitle).subscribe(() => {
            this.notification.show(this.transloco.translate('library.updateSuccess'));
            this.refreshData();
          });
        }
      }
    });
  }

  // Open modern Material Dialog to confirm document deletion
  openDeleteDialog(event: Event, item: ContentItem): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ActionDialog, {
      width: '400px',
      data: {
        mode: 'delete',
        title: this.transloco.translate('library.deleteModalTitle'),
        message: this.transloco.translate('library.deleteConfirmText', { title: item.title }),
        confirmText: this.transloco.translate('library.btnDelete'),
        confirmColor: 'warn',
      } as ActionDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed?: boolean) => {
      if (confirmed) {
        // If it's a mock item, remove it locally; otherwise call API
        if (item.id.startsWith('mock-')) {
          this.allItems.update((items) => items.filter((i) => i.id !== item.id));
          this.notification.show(this.transloco.translate('library.deleteSuccess'));
        } else {
          this.contentApi.deleteContent(item.id).subscribe(() => {
            this.notification.show(this.transloco.translate('library.deleteSuccess'));
            this.refreshData();
          });
        }
      }
    });
  }

  // Helper method to format bytes into readable KB/MB strings
  formatSize(bytes: number | null): string {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  // Format timestamp arrays or ISO strings into localized date strings
  formatDate(timestamp: string | number[]): string {
    if (!timestamp) return '-';
    if (Array.isArray(timestamp)) {
      const date = new Date(timestamp[0], timestamp[1] - 1, timestamp[2]);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  private refreshData(): void {
    this.contentApi.getLibraryItems().subscribe((items) => this.allItems.set(items));
  }
}
