import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
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
import { EmployeeBusinessTripsListComponent } from '../employees/employee-business-trips/employee-business-trips-list/employee-business-trips-list.component';
import { BusinessTripsComponent } from '../business-trips/business-trips.component';
import { BusinessTripsListComponent } from '../business-trips/business-trips-list/business-trips-list.component';
import { BusinessTripAddComponent } from '../business-trips/business-trip-add/business-trip-add.component';
import { BusinessTripDetailComponent } from '../business-trips/business-trip-detail/business-trip-detail.component';
import { BusinessTripEditComponent } from '../business-trips/business-trip-edit/business-trip-edit.component';
import { StaffGuard } from '../shared/guards/staff.guard';
import { RequistionsComponent } from '../requistions/requistions.component';
import { RequistionListComponent } from '../requistions/requistion-list/requistion-list.component';
import { RequistionAddComponent } from '../requistions/requistion-add/requistion-add.component';
import { RequistionDetailsComponent } from '../requistions/requistion-details/requistion-details.component';
import { RequistionEditComponent } from '../requistions/requistion-edit/requistion-edit.component';

const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      breadcrumb: 'Panel użytkownika'
    },
    children: [
      {
        path: '',
        component: DashboardHomeComponent,
        data: {
          breadcrumb: null
        }
      },
      {
        path: 'company',
        component: CompaniesComponent,
        data: {
          breadcrumb: 'Firmy'
        },
        children: [
          {
            path: '',
            component: CompanyListComponent,
            data: {
              breadcrumb: null
            }
          },
          {
            path: 'add',
            component: CompanyAddComponent,
            data: {
              breadcrumb: 'Dodaj firmę'
            }
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
            path: ':employeeId/business-trips',
            component: EmployeeBusinessTripsComponent,
            children: [
              {
                path: '',
                component: EmployeeBusinessTripsListComponent
              }
            ]
          }
        ],
        canActivate: [StaffGuard]
      },
      {
        path: 'business-trip',
        component: BusinessTripsComponent,
        children: [
          {
            path: '',
            component: BusinessTripsListComponent
          },
          {
            path: 'add',
            component: BusinessTripAddComponent
          },
          {
            path: ':id',
            component: BusinessTripDetailComponent
          },
          {
            path: ':id/edit',
            component: BusinessTripEditComponent
          }
        ]
      },
      {
        path: 'requisition',
        component: RequistionsComponent,
        children: [
          {
            path: '',
            component: RequistionListComponent
          },
          {
            path: 'add',
            component: RequistionAddComponent
          },
          {
            path: ':id',
            component: RequistionDetailsComponent
          },
          {
            path: ':id/edit',
            component: RequistionEditComponent
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
