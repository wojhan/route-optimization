import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

import { environment } from '@route-optimizer/environment/environment';
import { WayPoint } from '@route-optimizer/modules/map/components/route-map/WayPoint';
import { Route } from '../models/Route';
import { RouteType } from '../enums/RouteType';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private http: HttpClient) {}

  static createWaypoint(latLng: L.LatLng, name?: string, routeType?: RouteType): WayPoint {
    const w: WayPoint = L.Routing.waypoint(latLng, name) as WayPoint;
    w.routeType = routeType;
    return w;
  }

  getCoordsFromAddress(address: string): Observable<L.LatLng> {
    return this.http.get<[{ lat; lon }]>(`${environment.nominatimServerUrl}search?format=json&q=${address}`).pipe(
      switchMap((addresses: [{ lat; lon }]) => {
        if (addresses.length) {
          return of(addresses[0]);
        }

        throw throwError(new Error('Invalid query string'));
      }),
      map((a: { lat; lon }) => {
        return new L.LatLng(a.lat, a.lon);
      })
    );
  }

  getWaypoints(route: Route[]): WayPoint[] {
    const waypoints = [];
    route.forEach((point, pointIndex) => {
      waypoints.push(
        MapService.createWaypoint(
          L.latLng(point.startPoint.latitude, point.startPoint.longitude),
          point.startPoint.nameShort,
          point.routeType
        )
      );
      if (pointIndex === route.length - 1) {
        waypoints.push(
          MapService.createWaypoint(L.latLng(point.endPoint.latitude, point.endPoint.longitude), point.endPoint.nameShort, point.routeType)
        );
      }
    });
    return waypoints;
  }

  getRouteDistance(route: Route): Observable<number> {
    return new Observable<number>(subscriber => {
      const osrm = L.Routing.osrmv1({
        serviceUrl: environment.osrmServerUrl + '/route/v1'
      });

      osrm.route(this.getWaypoints([route]), (err?: L.Routing.IError, r?: L.Routing.IRoute) => {
        if (r) {
          subscriber.next(r[0].summary.totalDistance);
          subscriber.complete();
          return;
        } else {
          subscriber.error(err ? err : 'Error occurred');
        }

        subscriber.next(0);
        subscriber.complete();
      });
    });
  }

  initMap(mapOptions, mapId = 'map'): L.Map {
    const newMap = L.map(mapId, mapOptions);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(newMap);

    return newMap;
  }

  initMarker(latlng: L.LatLngExpression, options?: L.MarkerOptions) {
    return L.marker(latlng, options);
  }
}
