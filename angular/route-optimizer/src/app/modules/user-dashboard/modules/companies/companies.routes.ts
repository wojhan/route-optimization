import { Route } from '@angular/router';
import { CompanyListPage } from '@route-optimizer/modules/user-dashboard/modules/companies/pages/company-list.page';
import { CompaniesPage } from '@route-optimizer/modules/user-dashboard/modules/companies/pages/companies.page';
import { CompanyAddPage } from '@route-optimizer/modules/user-dashboard/modules/companies/pages/company-add.page';
import { CompanyDetailsPage } from '@route-optimizer/modules/user-dashboard/modules/companies/pages/company-details.page';
import { CompanyEditPage } from '@route-optimizer/modules/user-dashboard/modules/companies/pages/company-edit.page';
import { CompaniesResolve } from '@route-optimizer/modules/user-dashboard/modules/companies/companies.resolver';

export const CompaniesRoutes: Route[] = [
  {
    path: '',
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
          breadcrumb: 'Nowa firma'
        }
      },
      {
        path: ':id',
        component: CompanyDetailsPage,
        data: {
          breadcrumb: 'Szczegóły'
        },
        resolve: { company: CompaniesResolve }
      },
      {
        path: ':id/edit',
        component: CompanyEditPage,
        data: {
          breadcrumb: 'Edycja'
        },
        resolve: { company: CompaniesResolve }
      }
    ]
  }
];
