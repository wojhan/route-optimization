import { Route } from '@angular/router';
import { UserResolve } from '@route-optimizer/core/UserResolve';
import { UserDashboardPage } from '@route-optimizer/modules/user-dashboard/pages/user-dashboard.page';
import { UserDashboardHomePage } from '@route-optimizer/modules/user-dashboard/pages/user-dashboard-home/user-dashboard-home.page';
import { AuthGuard } from '@route-optimizer/core/guards/auth.guard';

export const UserDashboardRoutes: Route[] = [
  {
    path: '',
    component: UserDashboardPage,
    data: {
      breadcrumb: 'Panel użytkownika'
    },
    canActivate: [AuthGuard],
    resolve: { user: UserResolve },
    children: [
      { path: '', component: UserDashboardHomePage },
      { path: 'companies', loadChildren: './modules/companies/companies.module#CompaniesModule' }
    ]
  }
];
