import { Component, OnInit } from '@angular/core';
import { TimeDependentBusinessTrip } from '../../my-business-trips.component';
import { MyBusinessTripsService, BusinessTripState } from '../../my-business-trips.service';
import { delay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-future-business-trips',
  templateUrl: './future-business-trips.component.html',
  styleUrls: ['./future-business-trips.component.scss']
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
