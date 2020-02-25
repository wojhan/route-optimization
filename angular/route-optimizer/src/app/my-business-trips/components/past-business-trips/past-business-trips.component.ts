import { Component, OnInit } from '@angular/core';
import { TimeDependentBusinessTrip } from '../../my-business-trips.component';
import { MyBusinessTripsService, BusinessTripState } from '../../my-business-trips.service';
import { delay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-past-business-trips',
  templateUrl: './past-business-trips.component.html',
  styleUrls: ['./past-business-trips.component.scss']
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
