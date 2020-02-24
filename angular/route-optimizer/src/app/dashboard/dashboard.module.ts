import { NgModule } from '@angular/core';
import { DashboardRouting } from './dashboard-routing.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { LastRequisitionsComponent } from './dashboard-home/components/last-requisitions/last-requisitions.component';
import { ProfileComponent } from './dashboard-home/components/profile/profile.component';
import { UpdateProfileModalComponent } from './dashboard-home/components/update-profil-modal/update-profile-modal.component';
import { ChangePasswordModalComponent } from './dashboard-home/components/change-password-modal/change-password-modal.component';
import { CurrentBusinessTripComponent } from './dashboard-home/components/current-business-trip/current-business-trip.component';
import { LastBusinessTripComponent } from './dashboard-home/components/last-business-trip/last-business-trip.component';
import { BusinessTripStatsComponent } from './dashboard-home/components/business-trip-stats/business-trip-stats.component';
import { InactiveUsersComponent } from './dashboard-home/components/inactive-users/inactive-users.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardHomeComponent,
    SidebarComponent,
    LastRequisitionsComponent,
    ProfileComponent,
    UpdateProfileModalComponent,
    ChangePasswordModalComponent,
    CurrentBusinessTripComponent,
    LastBusinessTripComponent,
    BusinessTripStatsComponent,
    InactiveUsersComponent
  ],
  entryComponents: [UpdateProfileModalComponent, ChangePasswordModalComponent],
  imports: [SharedModule, DashboardRouting]
})
export class DashboardModule {}
