import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IconDefinition, faBars } from '@fortawesome/free-solid-svg-icons';
import { MenuItem } from 'primeng/api/menuitem';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

import { User } from '@route-optimizer/core/models/User';
import { AuthenticationService } from '@route-optimizer/core/services/authentication.service';
import { DashboardService } from '@route-optimizer/modules/dashboard/dashboard.service';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html'
})
export class BaseLayoutComponent implements OnInit, OnChanges {
  isSidebarHidden: boolean;
  user: BehaviorSubject<User>;
  isStaff: boolean;
  wrapperClasses: any;
  faBars: IconDefinition = faBars;

  home: MenuItem = { routerLink: ['/dashboard'] };
  menuItems;

  constructor(
    private authenticationService: AuthenticationService,
    private dashboardService: DashboardService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.user = this.authenticationService.currentUser;
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

  onToggledSidebar(): void {
    const currentState = this.dashboardService.getIsSidebarHidden();
    this.dashboardService.setIsSidebarHidden(!currentState);
    this.isSidebarHidden = this.dashboardService.getIsSidebarHidden();
    this.wrapperClasses.toggled = !this.dashboardService.getIsSidebarHidden();

    localStorage.setItem('isSidebarHidden', this.dashboardService.getIsSidebarHidden() ? 'true' : 'false');
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['login']);
  }
}
