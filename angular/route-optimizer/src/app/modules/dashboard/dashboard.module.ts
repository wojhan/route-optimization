import { NgModule } from '@angular/core';
import { DashboardRouting } from './dashboard-routing.component';
import { SharedModule } from '../../shared/shared.module';
import { DashboardPage } from './pages/dashboard.page';
import { SidebarComponent } from './components/sidebar.component';
import { DashboardHomePage } from './pages/dashboard-home.page';
import { ProfileComponent } from './components/profile.component';
import { UpdateProfileModal } from './components/modals/update-profile.modal';
import { ChangePasswordModal } from './components/modals/change-password.modal';
import { CurrentBusinessTripComponent } from './components/current-business-trip.component';
import { LastBusinessTripComponent } from './components/last-business-trip.component';
import { BusinessTripStatsComponent } from './components/business-trip-stats.component';
import { InactiveUsersComponent } from './components/inactive-users.component';
import { LastRequisitionsComponent } from './components/last-requisitions.component';

@NgModule({
  declarations: [
    DashboardPage,
    DashboardHomePage,
    SidebarComponent,
    LastRequisitionsComponent,
    ProfileComponent,
    UpdateProfileModal,
    ChangePasswordModal,
    CurrentBusinessTripComponent,
    LastBusinessTripComponent,
    BusinessTripStatsComponent,
    InactiveUsersComponent
  ],
  entryComponents: [UpdateProfileModal, ChangePasswordModal],
  imports: [SharedModule, DashboardRouting]
})
export class DashboardModule {}
