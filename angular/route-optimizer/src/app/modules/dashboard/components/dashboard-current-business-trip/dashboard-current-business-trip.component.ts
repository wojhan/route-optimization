import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { BusinessTrip } from '@route-optimizer/core/models/BusinessTrip';
import { BusinessTripService } from '@route-optimizer/core/services/business-trip.service';
import { AuthenticationService } from '@route-optimizer/core/services/authentication.service';
import { Page } from '@route-optimizer/core/models/Page';

@Component({
  selector: 'app-dashboard-current-business-trip',
  templateUrl: './dashboard-current-business-trip.component.html'
})
export class DashboardCurrentBusinessTripComponent implements OnInit {
  lastBusinessTrip: LastBusinessTrips;

  constructor(private authenticationService: AuthenticationService, private businessTripService: BusinessTripService) {}

  ngOnInit() {
    const userId = this.authenticationService.currentUser.getValue().id;
    const businessTrip = this.businessTripService.getCurrentBusinessTrips(1, userId).pipe(
      delay(1000),
      map((page: Page<BusinessTrip>) => page.results),
      tap(() => (this.lastBusinessTrip.loading = false))
    );
    this.lastBusinessTrip = { businessTrip, loading: true };
  }
}

// TODO: move to accurate place
// TODO: generic for all loading elements
interface LastBusinessTrips {
  businessTrip: Observable<BusinessTrip[]>;
  loading: boolean;
}
