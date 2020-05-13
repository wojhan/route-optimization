// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://192.168.8.69:8000/',
  wsBusinessTripUrl: 'ws://192.168.8.69:8000/',
  defaultPaginationSize: 40,
  maxPaginationSize: 100,
  numberOfBusinessTripsInCategory: 6,
  osrmServerUrl: 'http://192.168.8.69:5000',
  nominatimServerUrl: 'https://nominatim.openstreetmap.org/',
  map: {
    defaultMapOptions: {
      center: [52.19111111, 19.35527778],
      zoom: 6
    },
    defaultLat: 52.19111111,
    defaultLng: 19.35527778,
    defaultZoom: 6,
    singleElementZoom: 12
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
