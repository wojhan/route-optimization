import { NgModule } from '@angular/core';
import { BusinessTripsComponent } from './business-trips.component';
import { BusinessTripsListComponent } from './business-trips-list/business-trips-list.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { BusinessTripAddComponent } from './business-trip-add/business-trip-add.component';
import { BusinessTripFormComponent } from './business-trip-form/business-trip-form.component';
import { BusinessTripDetailComponent } from './business-trip-detail/business-trip-detail.component';
import { BusinessTripEditComponent } from './business-trip-edit/business-trip-edit.component';

@NgModule({
  declarations: [
    BusinessTripsComponent,
    BusinessTripsListComponent,
    BusinessTripAddComponent,
    BusinessTripFormComponent,
    BusinessTripDetailComponent,
    BusinessTripEditComponent
  ],
  imports: [SharedModule, RouterModule]
})
export class BusinessTripsModule {}
