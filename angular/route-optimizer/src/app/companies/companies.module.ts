import { NgModule } from '@angular/core';
import { CompaniesComponent } from './companies.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { CompanyAddComponent } from './company-add/company-add.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { PaginatorComponent } from '../paginator/paginator.component';
import { CompanyEditComponent } from './company-edit/company-edit.component';
import { CompanyFormComponent } from './company-form/company-form.component';

@NgModule({
  declarations: [
    CompaniesComponent,
    CompanyListComponent,
    CompanyDetailsComponent,
    CompanyAddComponent,
    CompanyEditComponent,
    CompanyFormComponent
  ],
  imports: [SharedModule, RouterModule]
})
export class CompaniesModule {}
