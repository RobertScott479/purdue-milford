import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogInterface } from '../layout/confirmation-dialog/confirmation.model';

export interface AlertDialogInterface {
  title: string;
  content: string;
}

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule, MatCardModule, MatButtonModule],
})
export class AlertDialogComponent {
  title: string;
  content: string;

  dialogRef = inject<MatDialogRef<AlertDialogComponent>>(MatDialogRef);
  data = inject<ConfirmationDialogInterface>(MAT_DIALOG_DATA);

  constructor() {
    this.title = this.data.title;
    this.content = this.data.content;
  }

  onClick(action: any): void {
    this.dialogRef.close(action);
  }
}
