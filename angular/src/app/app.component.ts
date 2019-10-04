import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserService } from "./user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public user: any;

  constructor(private _userService: UserService) {}

  ngOnInit() {
    this.user = {
      username: "",
      password: ""
    };

    if (this._userService.token) {
      console.log("zalogowany");
    } else {
      console.log("niezalogowany");
    }
  }
}
