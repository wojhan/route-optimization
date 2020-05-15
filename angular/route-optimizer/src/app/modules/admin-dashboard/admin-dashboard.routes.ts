import { Route } from '@angular/router';
import { BaseLayoutComponent } from '@route-optimizer/modules/base-layout/base-layout.component';

export const AdminDashboardRoutes: Route[] = [
  {
    path: '',
    component: BaseLayoutComponent,
    data: {
      breadcrumb: 'Panel administracyjny'
    }
  }
];
