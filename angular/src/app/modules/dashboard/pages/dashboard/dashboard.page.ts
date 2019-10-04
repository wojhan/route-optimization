import { Component, OnInit, Output, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from 'src/app/shared/services/user.service';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardComponent implements OnInit {
  user: User;
  isSidebarHidden: boolean;
  wrapperClasses: any;

  constructor(private userService: UserService, private dashboardService: DashboardService, private router: Router) {}

  ngOnInit() {
    this.user = new User();
    this.userService.getUsername().subscribe(username => (this.user.username = username));

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
    this.userService.logout();
    this.router.navigate(['login']);
  }
}
