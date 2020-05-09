import { Component, Input, OnInit } from '@angular/core';
import { faFlagCheckered, faMapMarker, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Route } from '@route-optimizer/core/models/Route';

@Component({
  selector: 'app-business-trip-detail-route-info-segment',
  templateUrl: './business-trip-detail-route-info-segment.component.html'
})
export class BusinessTripDetailRouteInfoSegmentComponent implements OnInit {
  @Input() routes: Route[];

  faMapMarker: IconDefinition = faMapMarker;
  faFlagCheckered: IconDefinition = faFlagCheckered;

  constructor() {}

  ngOnInit() {}
}
