import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from 'src/app/shared/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangePasswordErrorResponse } from '../profile/profile.component';

export interface ChangePasswordDialogData {
  passwordForm: FormGroup;
}

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent {
  errors: ChangePasswordErrorResponse;

  constructor(
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ChangePasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChangePasswordDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.userService.changePassword(this.data.passwordForm.value).subscribe({
      next: () => {
        this.dialogRef.close(this.data.passwordForm);
      },
      error: (err: HttpErrorResponse) => {
        this.errors = err.error;

        if (this.errors.oldPassword) {
          this.data.passwordForm.get('oldPassword').setErrors({ invalid: true });
        }
        this.cdRef.detectChanges();
      }
    });
  }
}
