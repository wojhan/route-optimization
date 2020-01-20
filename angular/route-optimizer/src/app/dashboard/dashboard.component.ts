import { Component, OnInit, OnChanges, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { faBars, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { UserService, User } from 'src/app/shared/services/user.service';
import { DashboardService } from './dashboard.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnChanges {
  isSidebarHidden: boolean;
  username: BehaviorSubject<string>;
  isStaff: boolean;
  wrapperClasses: any;
  faBars: IconDefinition = faBars;

  constructor(
    private userService: UserService,
    private dashboardService: DashboardService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.username = this.userService.username;

    this.userService.isStaff.subscribe(isStaff => (this.isStaff = isStaff));

    this.isSidebarHidden = this.dashboardService.getIsSidebarHidden();

    this.wrapperClasses = { toggled: !this.isSidebarHidden };
    this.cdRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdRef.detectChanges();
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
