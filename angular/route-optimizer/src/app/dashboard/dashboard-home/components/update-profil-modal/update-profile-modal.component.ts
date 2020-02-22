import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface UpdateProfileDialogData {
  profileForm: FormGroup;
}

@Component({
  selector: 'app-update-profile-modal',
  templateUrl: './update-profile-modal.component.html',
  styleUrls: ['./update-profile-modal.component.scss']
})
export class UpdateProfileModalComponent {
  constructor(public dialogRef: MatDialogRef<UpdateProfileModalComponent>, @Inject(MAT_DIALOG_DATA) public data: UpdateProfileDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {}
}
