import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { UserService, User } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  errors: LoginUserSerializerErrorResponse;

  constructor(public userService: UserService, private router: Router, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  login() {
    this.userService.login(this.loginForm.value).subscribe({
      next: (token: string) => {
        this.userService.token = token;
        localStorage.setItem('access_token', token);
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
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
