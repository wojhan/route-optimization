import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home.component';
import { CompanyAddComponent } from '../companies/company-add/company-add.component';
import { CompanyListComponent } from '../companies/company-list/company-list.component';
import { CompaniesComponent } from '../companies/companies.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { CompanyEditComponent } from '../companies/company-edit/company-edit.component';
import { CompanyDetailsComponent } from '../companies/company-details/company-details.component';
import { EmployeesComponent } from '../employees/employees.component';
import { EmployeeListComponent } from '../employees/employee-list/employee-list.component';
import { EmployeeBusinessTripsComponent } from '../employees/employee-business-trips/employee-business-trips.component';
import { EmployeeEditComponent } from '../employees/employee-edit/employee-edit.component';

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
        component: CompaniesComponent,
        children: [
          {
            path: '',
            component: CompanyListComponent
          },
          {
            path: 'add',
            component: CompanyAddComponent
          },
          {
            path: 'edit/:id',
            component: CompanyEditComponent
          },
          {
            path: ':id',
            component: CompanyDetailsComponent
          }
        ]
      },
      {
        path: 'employee',
        component: EmployeesComponent,
        children: [
          {
            path: '',
            component: EmployeeListComponent
          },
          {
            path: 'edit/:id',
            component: EmployeeEditComponent
          },
          {
            path: ':id/business-trips',
            component: EmployeeBusinessTripsComponent
          }
        ]
      }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class DashboardRouting {}
