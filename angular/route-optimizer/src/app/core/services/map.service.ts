import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { map as lmap, tileLayer, Map, marker, LatLngExpression, MarkerOptions, LatLng } from 'leaflet';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private http: HttpClient) {}

  getCoordsFromAddress(address: string): Observable<LatLng> {
    return this.http.get<[{ lat; lon }]>(`${environment.nominatimServerUrl}search?format=json&q=${address}`).pipe(
      switchMap((addresses: [{ lat; lon }]) => {
        if (addresses.length) {
          return of(addresses[0]);
        }

        throw throwError(new Error('Invalid query string'));
      }),
      map((a: { lat; lon }) => {
        return new LatLng(a.lat, a.lon);
      })
    );
  }

  initMap(mapOptions): Map {
    const newMap = lmap('map', mapOptions);

    const tiles = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(newMap);

    return newMap;
  }

  initMarker(latlng: LatLngExpression, options?: MarkerOptions) {
    return marker(latlng, options);
  }
}
