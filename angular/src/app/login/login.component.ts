import { Component, OnInit, Input } from '@angular/core';
import { LoginService, User } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /**
   * An object representing the user for the login form
   */
  // username: string;
  // password: string;

  @Input()
  user: User = new User();

  constructor(public loginService: LoginService, private router: Router) { }

  ngOnInit() {
    // this.username = '';
    // this.password = '';
    this.user = new User();
  }

  login() {
    this.loginService.login({
      username: this.user.username,
      password: this.user.password
    });
    this.router.navigate(['dashboard']);
  }
}
