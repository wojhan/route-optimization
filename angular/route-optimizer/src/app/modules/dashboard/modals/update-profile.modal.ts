import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface UpdateProfileDialogData {
  profileForm: FormGroup;
}

@Component({
  selector: 'app-update-profile-modal',
  templateUrl: './update-profile.modal.html'
})
export class UpdateProfileModal {
  constructor(public dialogRef: MatDialogRef<UpdateProfileModal>, @Inject(MAT_DIALOG_DATA) public data: UpdateProfileDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
