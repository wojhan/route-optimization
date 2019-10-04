import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.page';
import { NgModule } from '@angular/core';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { DashboardCompanyListComponent } from './pages/dashboard-company-list/dashboard-company-list.component';

const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: DashboardHomeComponent
      },
      {
        path: 'company',
        component: DashboardCompanyListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class DashboardRouting {}
