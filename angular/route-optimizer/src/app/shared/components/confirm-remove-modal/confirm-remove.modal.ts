import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmRemoveModalDialogData } from '../../../core/models/ConfirmRemoveModalDialogData';

@Component({
  selector: 'app-confirm-remove-modal',
  templateUrl: './confirm-remove.modal.html'
})
export class ConfirmRemoveModal {
  ok = true;
  constructor(public dialogRef: MatDialogRef<ConfirmRemoveModal>, @Inject(MAT_DIALOG_DATA) public data: ConfirmRemoveModalDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
