import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRouting } from './dashboard-routing.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './pages/dashboard/dashboard.page';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { DashboardCompanyListComponent } from './pages/dashboard-company-list/dashboard-company-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    JwPaginationComponent,
    DashboardComponent,
    DashboardHomeComponent,
    DashboardCompanyListComponent,
    SidebarComponent
  ],
  imports: [CommonModule, FormsModule, FontAwesomeModule, DashboardRouting]
})
export class DashboardModule {}
