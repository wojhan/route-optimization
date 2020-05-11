import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Route } from '@route-optimizer/core/models/Route';

@Component({
  selector: 'app-business-trip-detail-route-info',
  templateUrl: './business-trip-detail-route-info.component.html'
})
export class BusinessTripDetailRouteInfoComponent implements OnInit {
  @Input() businessTripDuration: number;
  @Input() routesByDay: Array<Route[]>;
  @Input() routes: Route[];

  @Output() routeChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output() segmentClicked: EventEmitter<Route> = new EventEmitter<Route>();

  segmentSelected: Route;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.segmentSelected = this.routes[0];
    setTimeout(() => {
      this.onSegmentClicked(this.segmentSelected);
    }, 200);
  }

  changeCurrentRoute(index: number) {
    this.routeChanged.emit(index);
    if (index >= 0) {
      this.onSegmentClicked(this.routesByDay[index][0]);
    } else {
      this.onSegmentClicked(this.routesByDay[0][0]);
    }
    this.cdRef.detectChanges();
  }

  onSegmentClicked(route: Route) {
    this.segmentSelected = route;
    this.segmentClicked.emit(route);
  }
}
