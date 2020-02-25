import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessTrip } from 'src/app/business-trips/business-trips.service';
import { MyBusinessTripsService, BusinessTripState } from '../../my-business-trips.service';
import { delay, tap } from 'rxjs/operators';
import { TimeDependentBusinessTrip } from '../../my-business-trips.component';

@Component({
  selector: 'app-current-business-trips',
  templateUrl: './current-business-trips.component.html',
  styleUrls: ['./current-business-trips.component.scss']
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
