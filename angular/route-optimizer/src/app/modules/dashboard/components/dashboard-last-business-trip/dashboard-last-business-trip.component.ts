import { Component, OnInit } from '@angular/core';
import { delay, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BusinessTrip } from '@route-optimizer/core/models/BusinessTrip';
import { AuthenticationService } from '@route-optimizer/core/services/authentication.service';
import { BusinessTripService } from '@route-optimizer/core/services/business-trip.service';
import { Page } from '@route-optimizer/core/models/Page';

@Component({
  selector: 'app-dashboard-last-business-trip',
  templateUrl: './dashboard-last-business-trip.component.html'
})
export class DashboardLastBusinessTripComponent implements OnInit {
  lastBusinessTrip: LastBusinessTrips;

  constructor(private authenticationService: AuthenticationService, private businessTripService: BusinessTripService) {}

  ngOnInit() {
    const userId = this.authenticationService.currentUser.getValue().id;
    const businessTrip = this.businessTripService.getPastBusinessTrips(1, userId).pipe(
      delay(1000),
      tap(() => (this.lastBusinessTrip.loading = false)),
      map((page: Page<BusinessTrip>) => page.results)
    );

    this.lastBusinessTrip = { businessTrip, loading: true };
  }
}

interface LastBusinessTrips {
  businessTrip: Observable<BusinessTrip[]>;
  loading: boolean;
}
