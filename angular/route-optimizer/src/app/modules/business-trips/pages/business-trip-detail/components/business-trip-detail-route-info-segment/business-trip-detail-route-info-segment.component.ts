import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Route } from '@route-optimizer/core/models/Route';
import { MapService } from '@route-optimizer/core/services/map.service';
import { MapMarker } from '@route-optimizer/modules/map/components/map-marker/map-marker';
import { RouteType } from '@route-optimizer/core/enums/RouteType';
import { BusinessTripService } from '@route-optimizer/core/services/business-trip.service';

@Component({
  selector: 'app-business-trip-detail-route-info-segment',
  templateUrl: './business-trip-detail-route-info-segment.component.html'
})
export class BusinessTripDetailRouteInfoSegmentComponent implements OnInit {
  @Input() routes: Route[];
  @Input() segmentSelected: Route;
  @Input() allDay: boolean;

  @Output() segmentClicked: EventEmitter<Route> = new EventEmitter<Route>();

  constructor(
    private mapService: MapService,
    private businessTripService: BusinessTripService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.routes.forEach(route => {
      this.mapService.getRouteDistance(route).subscribe({
        next: distance => {
          route.distance = Math.round(distance / 1000);
        }
      });
    });
  }

  getRouteMarkerIcon(route: Route, isStart: boolean): MapMarker {
    if (route === this.segmentSelected) {
      return isStart ? MapMarker.START : MapMarker.FINISH;
    }
    switch (route.routeType) {
      case RouteType.START:
      case RouteType.START_FROM_DEPOT:
        return isStart ? MapMarker.DEPOT : MapMarker.COMPANY;
      case RouteType.START_FROM_HOTEL:
        return isStart ? MapMarker.HOTEL : MapMarker.COMPANY;
      case RouteType.FINISH_AT_HOTEL:
        return isStart ? MapMarker.COMPANY : MapMarker.HOTEL;
      case RouteType.FINISH_AT_DEPOT:
      case RouteType.FINISH:
        return isStart ? MapMarker.COMPANY : MapMarker.DEPOT;
    }
    return MapMarker.COMPANY;
  }

  getRouteMarkerContent(route: Route, isStart: boolean): string | number {
    if (this.getRouteMarkerIcon(route, isStart) === MapMarker.COMPANY) {
      const businessTrip = this.route.snapshot.data.businessTrip;
      const companyNumbersByDay = this.businessTripService.getCompanyNumberInBusinessTrip(businessTrip);

      let companyOrder = 0;
      for (let i = 0; i < route.day; i++) {
        companyOrder += companyNumbersByDay[i];
      }

      companyOrder += route.segmentOrder;

      if (isStart) {
        return companyOrder;
      }

      return companyOrder + 1;
    }

    if (route === this.segmentSelected) {
      return isStart ? 'fa-flag' : 'fa-flag-checkered';
    }

    if (isStart) {
      if (route.routeType === RouteType.START || route.routeType === RouteType.START_FROM_DEPOT) {
        return 'fa-building';
      }
      if (route.routeType === RouteType.START_FROM_HOTEL) {
        return 'fa-hotel';
      }
    } else {
      if (route.routeType === RouteType.FINISH_AT_HOTEL) {
        return 'fa-hotel';
      }
      if (route.routeType === RouteType.FINISH || route.routeType === RouteType.FINISH_AT_DEPOT) {
        return 'fa-building';
      }
    }
    return '';
  }

  onSegmentClicked(route: Route) {
    this.cdRef.detectChanges();
    this.segmentClicked.emit(route);
  }
}
