import { NgModule } from '@angular/core';
import { MyBusinessTripsComponent } from './my-business-trips.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CurrentBusinessTripsComponent } from './components/current-business-trips/current-business-trips.component';
import { FutureBusinessTripsComponent } from './components/future-business-trips/future-business-trips.component';
import { PastBusinessTripsComponent } from './components/past-business-trips/past-business-trips.component';
import { BusinessTripCardsComponent } from './components/business-trip-cards/business-trip-cards.component';
import { BusinessTripCardComponent } from './components/business-trip-card/business-trip-card.component';

@NgModule({
  declarations: [
    MyBusinessTripsComponent,
    CurrentBusinessTripsComponent,
    FutureBusinessTripsComponent,
    PastBusinessTripsComponent,
    BusinessTripCardsComponent,
    BusinessTripCardComponent
  ],
  imports: [SharedModule, RouterModule]
})
export class MyBusinessTripsModule {}
