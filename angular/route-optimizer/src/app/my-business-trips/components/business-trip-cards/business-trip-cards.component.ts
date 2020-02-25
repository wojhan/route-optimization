import { Component, OnInit, Input } from '@angular/core';
import { BusinessTrip } from 'src/app/business-trips/business-trips.service';

@Component({
  selector: 'app-business-trip-cards',
  templateUrl: './business-trip-cards.component.html',
  styleUrls: ['./business-trip-cards.component.scss']
})
export class BusinessTripCardsComponent implements OnInit {
  @Input()
  businessTrips: BusinessTrip[];

  constructor() {}

  ngOnInit() {}
}
