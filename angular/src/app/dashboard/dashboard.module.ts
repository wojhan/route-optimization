import { NgModule } from '@angular/core';
import { DashboardRouting } from './dashboard-routing.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home.component';
import { SharedModule } from '../shared/shared.module';
import { LoginModule } from '../login/login.module';

@NgModule({
  declarations: [DashboardComponent, DashboardHomeComponent, SidebarComponent],
  imports: [SharedModule, DashboardRouting, LoginModule]
})
export class DashboardModule { }
