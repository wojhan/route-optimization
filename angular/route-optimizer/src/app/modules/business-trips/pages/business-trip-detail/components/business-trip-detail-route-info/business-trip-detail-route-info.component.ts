import { Component, Input, OnInit } from '@angular/core';
import { Route } from '@route-optimizer/core/models/Route';

@Component({
  selector: 'app-business-trip-detail-route-info',
  templateUrl: './business-trip-detail-route-info.component.html'
})
export class BusinessTripDetailRouteInfoComponent implements OnInit {
  @Input() businessTripDuration: number;
  @Input() routesByDay: Array<Route[]>;
  @Input() routes: Route[];

  constructor() {}

  ngOnInit() {}
}
