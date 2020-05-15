import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MapModule } from '@route-optimizer/modules/map/map.module';
import { SharedModule } from '@route-optimizer/shared/shared.module';
import { CompaniesPage } from './pages/companies.page';
import { CompanyAddPage } from './pages/company-add.page';
import { CompanyEditPage } from './pages/company-edit.page';
import { CompanyFormComponent } from './components/company-form.component';
import { HistoryComponent } from './components/history.component';
import { CompanyDetailsPage } from './pages/company-details.page';
import { CompanyListPage } from './pages/company-list.page';
import { CompaniesResolve } from './companies.resolver';
import { CompaniesRoutes } from './companies.routes';

@NgModule({
  declarations: [
    CompaniesPage,
    CompanyAddPage,
    CompanyEditPage,
    CompanyDetailsPage,
    CompanyListPage,
    CompanyFormComponent,
    HistoryComponent
  ],
  providers: [CompaniesResolve],
  imports: [SharedModule, MapModule, RouterModule.forChild(CompaniesRoutes)]
})
export class CompaniesModule {}
