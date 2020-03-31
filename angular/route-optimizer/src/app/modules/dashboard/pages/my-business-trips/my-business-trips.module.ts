import { NgModule } from '@angular/core';
import { MyBusinessTripsPage } from './pages/my-business-trips.page';
import { RouterModule } from '@angular/router';
import { CurrentBusinessTripsComponent } from './components/current-business-trips.component';
import { BusinessTripCardsComponent } from './components/business-trip-cards.component';
import { FutureBusinessTripsComponent } from './components/future-business-trips.component';
import { PastBusinessTripsComponent } from './components/past-business-trips.component';
import { BusinessTripCardComponent } from './components/business-trip-card.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    MyBusinessTripsPage,
    CurrentBusinessTripsComponent,
    FutureBusinessTripsComponent,
    PastBusinessTripsComponent,
    BusinessTripCardsComponent,
    BusinessTripCardComponent
  ],
  imports: [SharedModule, RouterModule]
})
export class MyBusinessTripsModule {}
