import { Component, OnInit, Output, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService, User } from '../login/login.service';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User;
  isSidebarHidden: boolean;
  wrapperClasses: any;

  constructor(private loginService: LoginService, private dashboardService: DashboardService, private router: Router) { }

  ngOnInit() {
    this.user = new User();
    this.loginService.getUsername().subscribe(username => (this.user.username = username));

    this.isSidebarHidden = this.dashboardService.getIsSidebarHidden();
    console.log(this.isSidebarHidden);

    this.wrapperClasses = { toggled: !this.isSidebarHidden };
  }

  toggleSidebar(): void {
    const currentState = this.dashboardService.getIsSidebarHidden();
    this.dashboardService.setIsSidebarHidden(!currentState);
    this.isSidebarHidden = this.dashboardService.getIsSidebarHidden();
    this.wrapperClasses.toggled = !this.dashboardService.getIsSidebarHidden();

    localStorage.setItem('isSidebarHidden', this.dashboardService.getIsSidebarHidden() ? 'true' : 'false');
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['login']);
  }
}
