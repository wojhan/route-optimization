import { Component, OnInit } from '@angular/core';
import { delay, tap } from 'rxjs/operators';
import { TimeDependentBusinessTrip } from '../pages/my-business-trips.page';
import { BusinessTripState, MyBusinessTripsService } from '../my-business-trips.service';

@Component({
  selector: 'app-past-business-trips',
  templateUrl: './past-business-trips.component.html'
})
export class PastBusinessTripsComponent implements OnInit {
  pastBusinessTrip: TimeDependentBusinessTrip;

  constructor(private myBusinessTripsService: MyBusinessTripsService) {}

  ngOnInit() {
    const businessTrip = this.myBusinessTripsService.getCurrentBusinessTrips(BusinessTripState.PAST).pipe(
      delay(1000),
      tap(() => (this.pastBusinessTrip.loading = false))
    );
    this.pastBusinessTrip = { businessTrip, loading: true };
  }
}
