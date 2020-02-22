import { Component, OnInit } from '@angular/core';
import { DashboardHomeService } from '../../dashboard-home.service';
import { delay, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BusinessTrip } from 'src/app/business-trips/business-trips.service';

@Component({
  selector: 'app-last-business-trip',
  templateUrl: './last-business-trip.component.html',
  styleUrls: ['./last-business-trip.component.scss']
})
export class LastBusinessTripComponent implements OnInit {
  lastBusinessTrip: LastBusinessTrips;

  constructor(private dashboardHomeService: DashboardHomeService) {}

  ngOnInit() {
    const businessTrip = this.dashboardHomeService.getLastBusinessTrips(1, 'past/').pipe(
      delay(1000),
      tap(() => (this.lastBusinessTrip.loading = false)),
      map((businessTrips: BusinessTrip[]) =>
        businessTrips.map((bt: BusinessTrip) => {
          bt.distance = Math.round(bt.distance);
          return bt;
        })
      )
    );
    this.lastBusinessTrip = { businessTrip, loading: true };
  }
}

interface LastBusinessTrips {
  businessTrip: Observable<BusinessTrip[]>;
  loading: boolean;
}
