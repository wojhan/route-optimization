import { Component, Input, OnInit } from '@angular/core';
import { faHourglassEnd, faHourglassStart, faRoute, faUserTie, faWallet, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { BusinessTrip } from '@route-optimizer/core/models/BusinessTrip';

@Component({
  selector: 'app-business-trip-detail-business-trip-info',
  templateUrl: './business-trip-detail-business-trip-info.component.html'
})
export class BusinessTripDetailBusinessTripInfoComponent implements OnInit {
  @Input() isProcessed = false;
  @Input() businessTrip: BusinessTrip;

  faHourGlassStart: IconDefinition = faHourglassStart;
  faHourGlassEnd: IconDefinition = faHourglassEnd;
  faUserTie: IconDefinition = faUserTie;
  faWallet: IconDefinition = faWallet;
  faRoute: IconDefinition = faRoute;

  constructor() {}

  ngOnInit() {}
}
