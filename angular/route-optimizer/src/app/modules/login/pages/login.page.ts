import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { User } from '../../../core/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html'
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  errors: LoginUserSerializerErrorResponse;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  login() {
    const { username, password } = this.loginForm.value;
    this.authenticationService.login(username, password).subscribe({
      next: (user: User) => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.errors = err.error;
        this.cdRef.detectChanges();
      }
    });
  }
}

interface LoginUserSerializerErrorResponse {
  non_field_errors?: string[];
  username?: string[];
  password?: string[];
}
