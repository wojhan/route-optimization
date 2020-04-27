import { Component, OnInit } from '@angular/core';
import { delay, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BusinessTrip } from '../../../core/models/BusinessTrip';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { BusinessTripService } from '../../../core/services/business-trip.service';
import { Page } from '../../../core/models/Page';

@Component({
  selector: 'app-last-business-trip',
  templateUrl: './last-business-trip.component.html'
})
export class LastBusinessTripComponent implements OnInit {
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
