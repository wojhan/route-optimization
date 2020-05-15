import { Component, OnInit } from '@angular/core';
import { BusinessTripFilter } from '@route-optimizer/modules/business-trips/BusinessTripFilter';

@Component({
  selector: 'app-my-business-trips',
  templateUrl: './my-business-trips.page.html'
})
export class MyBusinessTripsPage implements OnInit {
  titles: string[];
  filters: BusinessTripFilter[];
  fetched: boolean[];
  presentTimeFilter: BusinessTripFilter = BusinessTripFilter.PRESENT;
  pastTimeFilter: BusinessTripFilter = BusinessTripFilter.PAST;
  futureTimeFilter: BusinessTripFilter = BusinessTripFilter.FUTURE;
  constructor() {}

  ngOnInit() {
    this.titles = ['Aktualne delegacje', 'Nadchodzące delegacje', 'Zakończone delegacje'];
    this.filters = [BusinessTripFilter.PRESENT, BusinessTripFilter.FUTURE, BusinessTripFilter.PAST];
    this.fetched = [true, true, true];
  }

  onBusinessTripsFetched({ filter, fetched }) {
    this.fetched[filter] = fetched;
    console.log(filter, fetched);
  }
}
