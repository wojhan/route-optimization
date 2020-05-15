import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardPage } from './pages/dashboard.page';
import { AuthGuard } from '../../core/guards/auth.guard';
import { DashboardHomePage } from './pages/dashboard-home.page';
import { CompaniesPage } from './pages/companies/pages/companies.page';
import { CompanyListPage } from './pages/companies/pages/company-list.page';
import { CompanyAddPage } from './pages/companies/pages/company-add.page';
import { CompanyEditPage } from './pages/companies/pages/company-edit.page';
import { CompanyDetailsPage } from './pages/companies/pages/company-details.page';
import { RequistionListPage } from './pages/requisitions/pages/requistion-list.page';
import { CompaniesResolve } from './pages/companies/companies.resolver';
import { BusinessTripsPage } from '@route-optimizer/modules/business-trips/pages/business-trips.page';
import { BusinessTripDetailPage } from '@route-optimizer/modules/business-trips/pages/business-trip-detail/business-trip-detail.page';
import { BusinessTripsResolver } from '@route-optimizer/modules/business-trips/business-trips.resolver';
import { MyBusinessTripsPage } from '@route-optimizer/modules/business-trips/pages/my-business-trips/my-business-trips.page';

const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPage,
    data: {
      breadcrumb: 'Panel użytkownika'
    },
    children: [
      {
        path: '',
        component: DashboardHomePage,
        data: {
          breadcrumb: null
        }
      },
      {
        path: 'companies',
        component: CompaniesPage,
        data: {
          breadcrumb: 'Firmy'
        },
        children: [
          {
            path: '',
            component: CompanyListPage,
            data: {
              breadcrumb: null
            }
          },
          {
            path: 'add',
            component: CompanyAddPage,
            data: {
              breadcrumb: 'Dodaj firmę'
            }
          },
          {
            path: ':id/edit',
            component: CompanyEditPage,
            data: {
              breadcrumb: 'Edycja firmy'
            },
            resolve: { company: CompaniesResolve }
          },
          {
            path: ':id',
            component: CompanyDetailsPage,
            data: {
              breadcrumb: 'Szczegóły firmy'
            },
            resolve: { company: CompaniesResolve }
          }
        ]
      },
      {
        path: 'requisitions',
        component: RequistionListPage,
        data: {
          breadcrumb: 'Oferty'
        }
      },
      {
        path: 'my-business-trips',
        component: MyBusinessTripsPage,
        data: {
          breadcrumb: 'Twoje delegacje'
        }
      },
      {
        path: 'business-trips',
        component: BusinessTripsPage,
        data: {
          breadcrumb: 'Delegacje'
        },
        children: [
          {
            path: 'my-business-trips',
            component: MyBusinessTripsPage,
            data: {
              breadcrumb: 'Moje delegacje'
            }
          },
          {
            path: ':id',
            component: BusinessTripDetailPage,
            data: {
              breadcrumb: 'Szczegóły'
            },
            resolve: { businessTrip: BusinessTripsResolver }
          }
        ]
      }
      // {
      //   path: 'employees',
      //   component: EmployeesComponent,
      //   data: {
      //     breadcrumb: 'Pracownicy'
      //   },
      //   children: [
      //     {
      //       path: '',
      //       component: EmployeeListComponent,
      //       data: {
      //         breadcrumb: null
      //       }
      //     },
      //     {
      //       path: ':employeeId/business-trips',
      //       component: EmployeeBusinessTripsComponent,
      //       data: {
      //         breadcrumb: 'Delegacje pracownika'
      //       },
      //       children: [
      //         {
      //           path: '',
      //           component: EmployeeBusinessTripsListComponent,
      //           data: {
      //             breadcrumb: null
      //           }
      //         }
      //       ]
      //     }
      //   ],
      //   canActivate: [StaffGuard]
      // },
      // {
      //   path: 'business-trips',
      //   component: BusinessTripsComponent,
      //   data: {
      //     breadcrumb: 'Delegacje'
      //   },
      //   children: [
      //     {
      //       path: '',
      //       component: BusinessTripsListComponent,
      //       data: {
      //         breadcrumb: null
      //       }
      //     },
      //     {
      //       path: 'add',
      //       component: BusinessTripAddComponent,
      //       data: {
      //         breadcrumb: 'Dodaj delegację'
      //       }
      //     },
      //     {
      //       path: ':id',
      //       component: BusinessTripDetailPage,
      //       data: {
      //         breadcrumb: 'Szczegóły delegacji'
      //       }
      //     },
      //     {
      //       path: ':id/edit',
      //       component: BusinessTripEditComponent,
      //       data: {
      //         breadcrumb: 'Edycja delegacji'
      //       }
      //     }
      //   ]
      // },
      //
      //
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class DashboardRouting {}
