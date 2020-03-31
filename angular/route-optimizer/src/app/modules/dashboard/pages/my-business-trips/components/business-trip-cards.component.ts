import { Component, OnInit, Input } from '@angular/core';
import { BusinessTrip } from '../../../../../core/models/BusinessTrip';

@Component({
  selector: 'app-business-trip-cards',
  templateUrl: './business-trip-cards.component.html'
})
export class BusinessTripCardsComponent implements OnInit {
  @Input()
  businessTrips: BusinessTrip[];

  constructor() {}

  ngOnInit() {}
}
