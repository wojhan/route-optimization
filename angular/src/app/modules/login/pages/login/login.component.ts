import { Component, OnInit, Input } from '@angular/core';
import { UserService, User } from 'src/app/shared/services/user.service';
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

  constructor(public userService: UserService, private router: Router) {}

  ngOnInit() {
    // this.username = '';
    // this.password = '';
    this.user = new User();
  }

  login() {
    this.userService.login({
      username: this.user.username,
      password: this.user.password
    });
    this.router.navigate(['dashboard']);
  }
}
