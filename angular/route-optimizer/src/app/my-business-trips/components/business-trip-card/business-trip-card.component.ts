import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { BusinessTrip } from 'src/app/business-trips/business-trips.service';

@Component({
  selector: 'app-business-trip-card',
  templateUrl: './business-trip-card.component.html',
  styleUrls: ['./business-trip-card.component.scss']
})
export class BusinessTripCardComponent implements OnInit {
  @Input()
  businessTrip: BusinessTrip;

  mapId = 'map';

  map;
  lat;
  lng;
  zoom = 11;
  routeMap: any;
  mapRouter: any;
  formatter: any;
  openmap: any;
  mapControls: any[];
  routes: any[];
  routeColors = ['red', 'green', 'blue', 'black', 'purple', 'gray', 'orange'];

  constructor() {}

  ngOnInit() {
    this.mapId = `map${this.businessTrip.id}`;
    this.lat = this.businessTrip.routes.length > 0 ? this.businessTrip.routes[0].startPoint.latitude : 52.12;
    this.lng = this.businessTrip.routes.length > 0 ? this.businessTrip.routes[0].startPoint.longitude : 21.02;
  }
}
