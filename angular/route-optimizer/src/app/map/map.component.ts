import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { BusinessTrip } from '../business-trips/business-trips.service';

import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet.icon.glyph';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input()
  mapId = 'map';

  @Input()
  businessTrip: BusinessTrip;

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

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.businessTrip && this.businessTrip.isProcessed) {
      this.initMap();
      this.displayMap();
    }
  }

  private initMap(): void {
    this.routeMap = new L.Map(this.mapId);

    this.mapRouter = L.Routing.osrmv1({
      serviceUrl: 'http://localhost:5000/route/v1',
      language: 'pl'
    });

    this.formatter = new L.Routing.Formatter({
      language: 'pl'
    });

    this.openmap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> '
    }).addTo(this.routeMap);

    this.mapControls = [];
  }

  private displayMap(): void {
    this.mapControls.forEach(mapControl => {
      mapControl.remove();
    });

    this.mapControls = [];
    this.routes = [];

    for (let i = 0; i < this.businessTrip.duration; i++) {
      this.routes[i] = this.businessTrip.routes.filter(singleRoute => singleRoute.day === i);
    }

    this.routes.forEach((subroute, subrouteIndex) => {
      const singleRoute = [];
      subroute.forEach(waypoint => {
        singleRoute.push(
          new L.Routing.Waypoint(
            L.latLng(+waypoint.startPoint.latitude.toFixed(7), +waypoint.startPoint.longitude.toFixed(7)),
            waypoint.startPoint.nameShort
          )
        );
      });

      const generatedRoute = L.Routing.control({
        router: this.mapRouter,
        waypoints: singleRoute,
        collapsible: true,
        language: 'pl',
        lineOptions: {
          styles: [{ color: this.routeColors[subrouteIndex] }]
        },
        plan: L.Routing.plan(singleRoute, {
          createMarker: (i, wp, n) => {
            const iconOptions: L.icon = {
              prefix: '',
              cssClass: 'sans-serif',
              glyph: i + 1
            };
            if (i === 0 || i === n - 1) {
              iconOptions.iconUrl = '/assets/images/edgeMarker.png';
            }
            return L.marker(wp.latLng, {
              draggable: false,
              icon: L.icon.glyph(iconOptions)
            });
          },
          routeWhileDragging: false
        }),
        show: false
      }).addTo(this.routeMap);

      this.mapControls.push(generatedRoute);

      generatedRoute.on('routesfound', routes => {
        routes.routes[0].name = `Dzień ${subrouteIndex + 1} <br>
        Punkt startowy: ${routes.routes[0].waypoints[0].name} <br>
        Punkt końcowy: ${routes.routes[0].waypoints[routes.routes[0].waypoints.length - 1].name}`;
        routes.routes[0].instructions
          .filter(instruction => instruction.type === 'WaypointReached')
          .map((instruction, index) => {
            const text = instruction.text;
            const navigation = text.slice(32).match(/^,(.?)+/g);
            const newText = text.slice(0, 32) + routes.routes[0].waypoints[index + 1].name + (navigation ? navigation : '');
            instruction.text = newText;
            return instruction;
          });
      });
    });
  }
}
