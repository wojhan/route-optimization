import { Component, OnInit } from '@angular/core';
import { DashboardHomeService } from '../../dashboard-home.service';
import { Observable } from 'rxjs';
import { BusinessTrip } from 'src/app/business-trips/business-trips.service';
import { delay, tap } from 'rxjs/operators';
import { BusinessTripState } from '../../../../my-business-trips/my-business-trips.service';

@Component({
  selector: 'app-current-business-trip',
  templateUrl: './current-business-trip.component.html',
  styleUrls: ['./current-business-trip.component.scss']
})
export class CurrentBusinessTripComponent implements OnInit {
  lastBusinessTrip: LastBusinessTrips;

  constructor(private dashboardHomeService: DashboardHomeService) {}

  ngOnInit() {
    const businessTrip = this.dashboardHomeService.getLastBusinessTrips(1, BusinessTripState.CURRENT).pipe(
      delay(1000),
      tap(() => (this.lastBusinessTrip.loading = false))
    );
    this.lastBusinessTrip = { businessTrip, loading: true };
  }
}

interface LastBusinessTrips {
  businessTrip: Observable<BusinessTrip[]>;
  loading: boolean;
}
