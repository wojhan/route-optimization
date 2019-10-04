import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  /**
   * An object representing the user for the login form
   */
  public user: any;

  constructor(private _userService: UserService, private router: Router) {}

  ngOnInit() {
    this.user = {
      username: "",
      password: ""
    };
  }

  login() {
    this._userService.login({
      username: this.user.username,
      password: this.user.password
    });
    this.router.navigateByUrl("/");
  }

  refreshToken() {
    this._userService.refreshToken();
  }

  logout() {
    this._userService.logout();
  }
}
