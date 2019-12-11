import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  ok: boolean;
  content: string;
}

@Component({
  selector: 'app-delete-modal',
  templateUrl: 'delete-modal.component.html'
})
export class DeleteModalComponent {
  ok = true;
  constructor(public dialogRef: MatDialogRef<DeleteModalComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
