import { NgModule } from '@angular/core';
import { CompaniesPage } from './pages/companies.page';
import { SharedModule } from '../../../../shared/shared.module';
import { CompanyAddPage } from './pages/company-add.page';
import { CompanyEditPage } from './pages/company-edit.page';
import { CompanyFormComponent } from './components/company-form.component';
import { HistoryComponent } from './components/history.component';
import { CompanyDetailsPage } from './pages/company-details.page';
import { CompanyListPage } from './pages/company-list.page';
import { CompaniesResolve } from './companies.resolver';

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
  imports: [SharedModule]
})
export class CompaniesModule {}
