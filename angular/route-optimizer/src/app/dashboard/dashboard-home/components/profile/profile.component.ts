import { Component, OnInit } from '@angular/core';
import { IconDefinition, faUserCircle, faAt, faCalendarAlt, faCar, faKey, faEdit, faUser } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/shared/services/user.service';
import { DashboardHomeService } from '../../dashboard-home.service';
import { MatDialog } from '@angular/material';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UpdateProfileModalComponent } from '../update-profil-modal/update-profile-modal.component';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  faUserCircle: IconDefinition = faUserCircle;
  faAt: IconDefinition = faAt;
  faCalendarAlt: IconDefinition = faCalendarAlt;
  faCar: IconDefinition = faCar;
  faKey: IconDefinition = faKey;
  faEdit: IconDefinition = faEdit;
  faUser: IconDefinition = faUser;

  lastBusinessTrip: string;

  constructor(public userService: UserService, private dashboardHomeService: DashboardHomeService, public dialog: MatDialog) {}

  ngOnInit() {
    this.dashboardHomeService.getLastBusinessTrips(1).subscribe(last => {
      if (last.length > 0) {
        this.lastBusinessTrip = last[0].finishDate;
      } else {
        this.lastBusinessTrip = 'nigdy';
      }
    });
  }

  editProfile(): void {
    const user = this.userService.user.getValue();
    const profileForm = new FormGroup({
      firstName: new FormControl(user.firstName, [Validators.required]),
      lastName: new FormControl(user.lastName, [Validators.required]),
      email: new FormControl(user.email, [Validators.required, Validators.email])
    });

    const dialogRef = this.dialog.open(UpdateProfileModalComponent, {
      width: '400px',
      data: {
        profileForm
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateProfile(result.value).subscribe(data => {
          this.userService.user.next(data);
        });
      }
    });
  }

  changePassword(): void {
    const passwordForm: FormGroup = new FormGroup({
      oldPassword: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      password2: new FormControl(null, [Validators.required])
    });

    passwordForm.get('password2').valueChanges.subscribe(value => {
      if (value !== passwordForm.get('password').value) {
        passwordForm.get('password2').setErrors({ passwordMismatch: true });
      } else {
        passwordForm.get('password2').setErrors(null);
      }
    });

    const dialogRef = this.dialog.open(ChangePasswordModalComponent, {
      width: '400px',
      data: {
        passwordForm
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.logout();
        location.reload();
      }
    });
  }
}

export interface FormErrorResponse {
  nonFieldErrors?: string[];
}

export interface ChangePasswordErrorResponse extends FormErrorResponse {
  oldPassword?: string[];
  password?: string[];
  password2?: string[];
}
