import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@route-optimizer/shared/shared.module';
import { BusinessTripsPage } from './pages/business-trips.page';
import { BusinessTripDetailBusinessTripInfoComponent } from './pages/business-trip-detail/components/business-trip-detail-business-trip-info/business-trip-detail-business-trip-info.component';
import { BusinessTripDetailFailureComponent } from './pages/business-trip-detail/components/business-trip-detail-failure/business-trip-detail-failure.component';
import { BusinessTripDetailPage } from './pages/business-trip-detail/business-trip-detail.page';
import { BusinessTripDetailRouteInfoComponent } from './pages/business-trip-detail/components/business-trip-detail-route-info/business-trip-detail-route-info.component';
import { BusinessTripDetailRouteInfoSegmentComponent } from './pages/business-trip-detail/components/business-trip-detail-route-info-segment/business-trip-detail-route-info-segment.component';
import { BusinessTripsResolver } from './business-trips.resolver';
import { MapModule } from '@route-optimizer/modules/map/map.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MyBusinessTripsPage } from './pages/my-business-trips/my-business-trips.page';
import { BusinessTripCardsComponent } from './pages/my-business-trips/components/business-trip-cards/business-trip-cards.component';
import { BusinessTripCardComponent } from './pages/my-business-trips/components/business-trip-card/business-trip-card.component';

@NgModule({
  declarations: [
    BusinessTripsPage,
    BusinessTripDetailBusinessTripInfoComponent,
    BusinessTripDetailFailureComponent,
    BusinessTripDetailPage,
    BusinessTripDetailRouteInfoComponent,
    BusinessTripDetailRouteInfoSegmentComponent,
    MyBusinessTripsPage,
    BusinessTripCardsComponent,
    BusinessTripCardComponent
  ],
  providers: [BusinessTripsResolver],
  imports: [MapModule, RouterModule, FontAwesomeModule, CommonModule, SharedModule]
})
export class BusinessTripsModule {}
