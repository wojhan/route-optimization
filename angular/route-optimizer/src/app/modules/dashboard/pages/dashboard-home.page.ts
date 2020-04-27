import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../../core/models/User';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.page.html'
})
export class DashboardHomePage implements OnInit {
  isStaff: Observable<boolean>;

  constructor(private authenticationService: AuthenticationService) {}
  ngOnInit() {
    this.isStaff = this.authenticationService.currentUser.pipe(map((user: User) => user.isStaff));
  }
}
