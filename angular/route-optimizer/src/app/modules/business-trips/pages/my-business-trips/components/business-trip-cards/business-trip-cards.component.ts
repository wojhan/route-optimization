import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BusinessTripFilter } from '@route-optimizer/modules/business-trips/BusinessTripFilter';
import { BusinessTripService } from '@route-optimizer/core/services/business-trip.service';
import { AuthenticationService } from '@route-optimizer/core/services/authentication.service';
import { FetchableContentList } from '@route-optimizer/core/models/FetchableContentList';
import { BusinessTrip } from '@route-optimizer/core/models/BusinessTrip';
import { delay, finalize, map } from 'rxjs/operators';
import { Page } from '@route-optimizer/core/models/Page';

@Component({
  selector: 'app-my-business-trips-business-trip-cards',
  templateUrl: './business-trip-cards.component.html'
})
export class BusinessTripCardsComponent implements OnInit {
  @Input() timeFilter: BusinessTripFilter;

  @Output() businessTripsFetched: EventEmitter<{ filter: BusinessTripFilter; fetched: boolean }> = new EventEmitter();

  businessTrips: FetchableContentList<BusinessTrip> = { data: null, loading: true };

  constructor(private businessTripService: BusinessTripService, private authenticationService: AuthenticationService) {}

  ngOnInit() {
    const userId = this.authenticationService.currentUser.getValue().id;
    this.businessTripService
      .getBusinessTripsByFilter(this.timeFilter, 6, userId)
      .pipe(
        delay(500),
        map((page: Page<BusinessTrip>) => page.results),
        finalize(() => (this.businessTrips.loading = false))
      )
      .subscribe({
        next: (businessTrips: BusinessTrip[]) => {
          this.businessTrips.data = businessTrips;
          this.updateBusinessTripFetched();
        }
      });
  }

  updateBusinessTripFetched(): void {
    const result = {
      filter: this.timeFilter,
      fetched: !!this.businessTrips.data.length
    };

    this.businessTripsFetched.emit(result);
  }
}
