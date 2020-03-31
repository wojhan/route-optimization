import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { User } from '../../../core/models/User';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html'
})
export class RegistrationPage implements OnInit {
  registrationForm: FormGroup;
  errors: RegisterUserSerializerErrorResponse;

  constructor(private authenticationService: AuthenticationService, private cdRef: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.registrationForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      password2: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email])
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
    this.authenticationService.register(this.registrationForm.value).subscribe({
      next: (user: User) => {
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
  nonFieldErrors?: string[];
  firstName?: string[];
  lastName?: string[];
  username?: string[];
  password?: string[];
  email?: string[];
}
