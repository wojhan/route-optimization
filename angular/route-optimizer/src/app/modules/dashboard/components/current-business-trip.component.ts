import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { BusinessTrip } from '../../../core/models/BusinessTrip';
import { BusinessTripService } from '../../../core/services/business-trip.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Page } from '../../../core/models/Page';

@Component({
  selector: 'app-current-business-trip',
  templateUrl: './current-business-trip.component.html'
})
export class CurrentBusinessTripComponent implements OnInit {
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
