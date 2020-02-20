import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from '../shared/custom.validators';
import { UserService } from '../shared/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  errors: RegisterUserSerializerErrorResponse;

  constructor(private userService: UserService, private cdRef: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.registrationForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.registrationForm
      .get('password2')
      .valueChanges.pipe(debounceTime(100))
      .subscribe(value => {
        if (value !== this.registrationForm.get('password').value) {
          this.registrationForm.get('password2').setErrors({ passwordMismatch: true });
        } else {
          this.registrationForm.get('password2').setErrors(null);
        }
      });
  }

  register(): void {
    this.userService.register(this.registrationForm.value).subscribe({
      next: (user: any) => {
        this.router.navigate(['/register/complete']);
      },
      error: (err: HttpErrorResponse) => {
        this.errors = err.error;
        this.registrationForm.get('username').setErrors(this.errors.username ? { inUse: true } : null);
        this.cdRef.detectChanges();
        console.log(err.error);
      }
    });
  }
}

interface RegisterUserSerializerErrorResponse {
  non_field_errors?: string[];
  firstName?: string[];
  lastName?: string[];
  username?: string[];
  password?: string[];
  email?: string[];
}
