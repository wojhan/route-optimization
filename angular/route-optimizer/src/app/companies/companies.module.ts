import { NgModule } from '@angular/core';
import { CompaniesComponent } from './companies.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { CompanyAddComponent } from './company-add/company-add.component';
import { SharedModule } from '../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompaniesService } from './companies.service';
import { PaginatorComponent } from '../paginator/paginator.component';

@NgModule({
  declarations: [
    CompaniesComponent,
    CompanyListComponent,
    CompanyDetailsComponent,
    CompanyAddComponent,
    PaginatorComponent
  ],
  imports: [SharedModule, RouterModule]
})
export class CompaniesModule {}
