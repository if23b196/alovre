import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { A11yModule } from '@angular/cdk/a11y';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

export interface ActionDialogData {
  mode: 'edit' | 'delete';
  title: string;
  message?: string;
  initialValue?: string;
  placeholder?: string;
  confirmText: string;
  confirmColor?: 'primary' | 'warn';
}

@Component({
  selector: 'app-action-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    A11yModule,
    FormsModule,
    TranslocoDirective,
  ],
  templateUrl: './action-dialog.html',
  styleUrl: './action-dialog.scss',
})
export class ActionDialog {
  private dialogRef = inject(MatDialogRef<ActionDialog>);
  data = inject<ActionDialogData>(MAT_DIALOG_DATA);

  value = signal(this.data.initialValue || '');

  confirm(): void {
    if (this.data.mode === 'edit') {
      if (this.value().trim()) {
        this.dialogRef.close(this.value().trim());
      }
    } else {
      this.dialogRef.close(true);
    }
  }
}
