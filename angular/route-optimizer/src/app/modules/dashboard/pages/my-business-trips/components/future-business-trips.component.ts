import { Component, OnInit } from '@angular/core';
import { delay, tap } from 'rxjs/operators';
import { TimeDependentBusinessTrip } from '../pages/my-business-trips.page';
import { BusinessTripState, MyBusinessTripsService } from '../my-business-trips.service';

@Component({
  selector: 'app-future-business-trips',
  templateUrl: './future-business-trips.component.html'
})
export class FutureBusinessTripsComponent implements OnInit {
  futureBusinessTrip: TimeDependentBusinessTrip;

  constructor(private myBusinessTripsService: MyBusinessTripsService) {}

  ngOnInit() {
    const businessTrip = this.myBusinessTripsService.getCurrentBusinessTrips(BusinessTripState.FUTURE).pipe(
      delay(1000),
      tap(() => (this.futureBusinessTrip.loading = false))
    );
    this.futureBusinessTrip = { businessTrip, loading: true };
  }
}
