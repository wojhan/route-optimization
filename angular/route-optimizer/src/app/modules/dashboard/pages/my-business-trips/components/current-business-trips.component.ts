import { Component, OnInit } from '@angular/core';
import { delay, tap } from 'rxjs/operators';
import { TimeDependentBusinessTrip } from '../pages/my-business-trips.page';
import { BusinessTripState, MyBusinessTripsService } from '../my-business-trips.service';

@Component({
  selector: 'app-current-business-trips',
  templateUrl: './current-business-trips.component.html'
})
export class CurrentBusinessTripsComponent implements OnInit {
  currentBusinessTrip: TimeDependentBusinessTrip;

  constructor(private myBusinessTripsService: MyBusinessTripsService) {}

  ngOnInit() {
    const businessTrip = this.myBusinessTripsService.getCurrentBusinessTrips(BusinessTripState.CURRENT).pipe(
      delay(1000),
      tap(() => (this.currentBusinessTrip.loading = false))
    );
    this.currentBusinessTrip = { businessTrip, loading: true };
  }
}
