import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogInterface } from './confirmation.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  standalone: true,
  imports: [MatDividerModule, MatButtonModule, MatDialogModule, MatIconModule],
})
export class ConfirmationDialogComponent {
  dialogRef = inject<MatDialogRef<ConfirmationDialogComponent>>(MatDialogRef);
  data = inject<ConfirmationDialogInterface>(MAT_DIALOG_DATA);

  title: string;
  content: string;
  yesButton: string = '';
  noButton: string = '';
  cancelButton: string = '';
  constructor() {
    const data = this.data;

    this.title = data.title;
    this.content = data.content;
    this.yesButton = data.yesButton ?? '';
    this.noButton = data.noButton ?? '';
    this.cancelButton = data.cancelButton ?? '';
  }

  onClick(action: any): void {
    this.dialogRef.close(action);
  }
}
