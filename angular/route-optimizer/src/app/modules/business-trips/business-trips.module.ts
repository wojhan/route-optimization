import { NgModule } from '@angular/core';

import { SharedModule } from '@route-optimizer/shared/shared.module';
import { BusinessTripsPage } from './pages/business-trips.page';
import { BusinessTripDetailBusinessTripInfoComponent } from './pages/business-trip-detail/components/business-trip-detail-business-trip-info/business-trip-detail-business-trip-info.component';
import { BusinessTripDetailFailureComponent } from './pages/business-trip-detail/components/business-trip-detail-failure/business-trip-detail-failure.component';
import { BusinessTripDetailPage } from './pages/business-trip-detail/business-trip-detail.page';
import { BusinessTripDetailRouteInfoComponent } from './pages/business-trip-detail/components/business-trip-detail-route-info/business-trip-detail-route-info.component';
import { BusinessTripDetailRouteInfoSegmentComponent } from './pages/business-trip-detail/components/business-trip-detail-route-info-segment/business-trip-detail-route-info-segment.component';
import { BusinessTripsResolver } from './business-trips.resolver';

@NgModule({
  declarations: [
    BusinessTripsPage,
    BusinessTripDetailBusinessTripInfoComponent,
    BusinessTripDetailFailureComponent,
    BusinessTripDetailPage,
    BusinessTripDetailRouteInfoComponent,
    BusinessTripDetailRouteInfoSegmentComponent
  ],
  providers: [BusinessTripsResolver],
  imports: [SharedModule]
})
export class BusinessTripsModule {}
