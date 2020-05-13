import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet.icon.glyph';

import { environment } from '@route-optimizer/environment/environment';
import { MapService } from '@route-optimizer/core/services/map.service';
import { Route } from '@route-optimizer/core/models/Route';
import { RouteType } from '@route-optimizer/core/enums/RouteType';
import { WayPoint } from '@route-optimizer/modules/map/components/route-map/WayPoint';

@Component({
  selector: 'app-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.scss']
})
export class RouteMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() mapId = 'map';
  @Input() mapOptions: L.MapOptions = environment.map.defaultMapOptions as L.MapOptions;
  @Input() routes: Array<Route[]>;
  @Input() activeRouteSegment: Route;
  @Input() mapSegmentation = false;

  routeMap: L.Map;
  mapRouter: L.Routing.OSRMv1;
  formatter: L.Routing.Formatter;
  mapControls = [];
  activeRouteSegmentMapControl;
  companiesOnMap = 0;
  routeColors = ['red', 'green', 'blue'];
  inactivePane;
  inactiveMarkerPane;
  activePane;
  activeMarkerPane;

  constructor(private mapService: MapService) {}

  ngOnDestroy() {
    if (this.routeMap) {
      this.routeMap.remove();
    }
  }

  ngAfterViewInit() {
    this.initMap();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.routes && this.routeMap) {
      this.updateMap();
    }
    if (changes.activeRouteSegment) {
      if (this.activeRouteSegmentMapControl) {
        this.activeRouteSegmentMapControl.remove();
      }
      this.updateRouteSegment();
    }
  }
  private createWaypoint(latLng: L.LatLng, name?: string, routeType?: RouteType): WayPoint {
    const w: WayPoint = L.Routing.waypoint(latLng, name) as WayPoint;
    w.routeType = routeType;
    return w;
  }

  private createMarker(waypointIndex: number, waypoint: WayPoint, numberWaypoints: number, isActive: boolean): L.Marker {
    let iconUrl = '/assets/images/map-markers/';
    let pane = 'inactive-marker-pane';
    let glyph = '';
    let prefix = '';

    switch (waypoint.routeType) {
      case RouteType.START:
      case RouteType.START_FROM_DEPOT:
      case RouteType.FINISH:
        iconUrl += 'depot-marker.svg';
        glyph = 'building';
        prefix = 'fas';
        break;
      case RouteType.START_FROM_HOTEL:
      case RouteType.FINISH_AT_HOTEL:
        iconUrl += 'hotel-marker.svg';
        glyph = 'hotel';
        prefix = 'fas';
        break;
      case RouteType.START_SEGMENT:
        iconUrl += 'start-marker.svg';
        pane = 'active-marker-pane';
        glyph = 'flag';
        prefix = 'fas';
        break;
      case RouteType.FINISH_SEGMENT:
        iconUrl += 'finish-marker.svg';
        pane = 'active-marker-pane';
        glyph = 'flag-checkered';
        prefix = 'fas';
        break;
      case RouteType.VISIT:
        iconUrl += 'company-marker.svg';
        glyph = (++this.companiesOnMap).toString();
        break;
      default:
        iconUrl += 'company-marker.svg';
        break;
    }
    const iconOptions: L.Icon.GlyphOptions = {
      className: 'map-marker',
      glyphColor: 'black',
      glyph,
      prefix,
      iconUrl
    };

    const marker = L.marker(waypoint.latLng, {
      draggable: false,
      icon: L.icon.glyph(iconOptions),
      pane
    });

    marker.bindPopup(waypoint.name, { pane });
    if (isActive) {
      marker.openPopup();
    }

    return marker;
  }

  private getWaypoints(route: Route[], isSegment: boolean = false): WayPoint[] {
    const waypoints = [];

    if (isSegment) {
      waypoints.push(
        this.createWaypoint(
          L.latLng(route[0].startPoint.latitude, route[0].startPoint.longitude),
          route[0].startPoint.nameShort,
          RouteType.START_SEGMENT
        )
      );
      waypoints.push(
        this.createWaypoint(
          L.latLng(route[0].endPoint.latitude, route[0].endPoint.longitude),
          route[0].endPoint.nameShort,
          RouteType.FINISH_SEGMENT
        )
      );
      return waypoints;
    }

    route.forEach((point, pointIndex) => {
      const startPointRouteType: RouteType = pointIndex === route.length - 1 ? RouteType.VISIT : point.routeType;
      waypoints.push(
        this.createWaypoint(
          L.latLng(point.startPoint.latitude, point.startPoint.longitude),
          point.startPoint.nameShort,
          startPointRouteType
        )
      );
      if (pointIndex === route.length - 1) {
        waypoints.push(
          this.createWaypoint(L.latLng(point.endPoint.latitude, point.endPoint.longitude), point.endPoint.nameShort, point.routeType)
        );
      }
    });
    return waypoints;
  }

  private getPlan(waypoints: WayPoint[], isActive: boolean = false): L.Routing.Plan {
    return L.Routing.plan(waypoints, {
      createMarker: (waypointIndex: number, waypoint: WayPoint, numberWaypoints: number) =>
        this.createMarker(waypointIndex, waypoint, numberWaypoints, isActive)
    });
  }

  private getLineOptions(isActive: boolean): L.Routing.LineOptions {
    const pane = isActive ? 'active-pane' : 'inactive-pane';
    const weight = isActive ? 5 : 3;
    let color = isActive ? 'red' : 'gray';

    if (!this.mapSegmentation) {
      color = this.routeColors[this.mapControls.length];
    }

    return {
      styles: [{ pane, color, weight }]
    };
  }

  private getMapControl(route: Route[], isActive: boolean = false) {
    const waypoints = this.getWaypoints(route, isActive);
    return L.Routing.control({
      router: this.mapRouter,
      fitSelectedRoutes: false,
      waypoints,
      collapsible: true,
      plan: this.getPlan(waypoints, true),
      lineOptions: this.getLineOptions(isActive),
      show: false
    });
  }

  private initMap(): void {
    this.routeMap = this.mapService.initMap(environment.map.defaultMapOptions, this.mapId);
    this.mapRouter = L.Routing.osrmv1({
      serviceUrl: environment.osrmServerUrl + `/route/v1`
    });

    this.formatter = new L.Routing.Formatter({
      language: 'pl'
    });

    this.inactivePane = this.routeMap.createPane('inactive-pane');
    this.inactiveMarkerPane = this.routeMap.createPane('inactive-marker-pane');
    this.activePane = this.routeMap.createPane('active-pane');
    this.activeMarkerPane = this.routeMap.createPane('active-marker-pane');

    this.activePane.style.zIndex = 3000;
    this.activeMarkerPane.style.zIndex = 5000;
    this.inactivePane.style.zIndex = 2000;
    this.inactiveMarkerPane.style.zIndex = 4000;

    this.companiesOnMap = 0;

    this.mapControls = [];

    this.updateMap();
  }

  private clearMapControls(): void {
    this.mapControls.forEach(control => {
      control.remove();
    });
    this.mapControls = [];
    this.companiesOnMap = 0;
  }

  private updateMap(): void {
    this.clearMapControls();
    let waypoints = [];

    this.routes.forEach((route, routeIndex) => {
      const control = this.getMapControl(route);
      control.addTo(this.routeMap);
      this.mapControls.push(control);
    });

    this.mapControls.forEach((control: L.Routing.Control) => {
      waypoints = waypoints.concat(control.getWaypoints());
    });

    const bounds = L.latLngBounds(waypoints.map(w => w.latLng)).pad(0.2);
    this.routeMap.fitBounds(bounds);
  }

  private updateRouteSegment(): void {
    if (this.activeRouteSegment && this.mapSegmentation) {
      this.activeRouteSegmentMapControl = this.getMapControl([this.activeRouteSegment], true).addTo(this.routeMap);
    }
  }
}
