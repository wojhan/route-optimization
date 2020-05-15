import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseLayoutModule } from '@route-optimizer/modules/base-layout/base-layout.module';
import { RouterModule } from '@angular/router';
import { UserDashboardRoutes } from '@route-optimizer/modules/user-dashboard/user-dashboard.routes';
import { UserDashboardPage } from './pages/user-dashboard.page';
import { SharedModule } from '@route-optimizer/shared/shared.module';
import { UserDashboardHomePage } from './pages/user-dashboard-home/user-dashboard-home.page';
import { DashboardModule } from '@route-optimizer/modules/dashboard/dashboard.module';

@NgModule({
  declarations: [UserDashboardPage, UserDashboardHomePage],
  imports: [SharedModule, DashboardModule, BaseLayoutModule, RouterModule.forChild(UserDashboardRoutes)]
})
export class UserDashboardModule {}
