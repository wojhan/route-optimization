import { Component, OnInit, OnChanges, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { faBars, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { UserService, User } from 'src/app/shared/services/user.service';
import { DashboardService } from './dashboard.service';
import { BehaviorSubject, pipe } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuItem } from 'primeng/api/menuitem';
import { isNullOrUndefined } from 'util';

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

  home: MenuItem = { routerLink: ['/dashboard'] };
  menuItems;

  constructor(
    private userService: UserService,
    private dashboardService: DashboardService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.username = this.userService.username;

    this.userService.isStaff.subscribe(isStaff => (this.isStaff = isStaff));

    this.isSidebarHidden = this.dashboardService.getIsSidebarHidden();

    this.wrapperClasses = { toggled: !this.isSidebarHidden };

    this.menuItems = this.createBreadcrumbs(this.activatedRoute.root);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => (this.menuItems = this.createBreadcrumbs(this.activatedRoute.root)));

    this.cdRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdRef.detectChanges();
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    let routerLink = [url];

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
        routerLink = [url];
      }

      const label = child.snapshot.data.breadcrumb;
      if (!isNullOrUndefined(label)) {
        breadcrumbs.push({ label, routerLink });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
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
