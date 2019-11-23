import { Component, OnInit, Input } from "@angular/core";
import { UserService, User } from "src/app/shared/services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  @Input()
  user: User = new User();

  constructor(public userService: UserService, private router: Router) {}

  ngOnInit() {
    this.user = new User();
  }

  login() {
    this.userService.login({
      username: this.user.username,
      password: this.user.password
    });
  }
}
