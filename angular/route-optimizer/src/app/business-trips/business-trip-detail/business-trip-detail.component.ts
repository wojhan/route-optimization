import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessTripsService, BusinessTrip } from '../business-trips.service';
import { WebSocketService, WebSocketMessage } from 'src/app/shared/services/websocket.service';
import { switchMap, map, delay } from 'rxjs/operators';
import { of, concat, EMPTY, Observable, Subject } from 'rxjs';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet.icon.glyph';

import { MatSelect } from '@angular/material';

@Component({
  selector: 'app-business-trip-detail',
  templateUrl: './business-trip-detail.component.html',
  styleUrls: ['./business-trip-detail.component.scss']
})
export class BusinessTripDetailComponent implements OnInit, OnDestroy, AfterViewChecked {
  businessTrip: BusinessTrip;

  routes = [];
  errors = [];

  currentProgress = 0;
  timeLeft;
  selectedDay = 'all';

  dir = null;
  dir1 = null;

  route1: Subject<any> = new Subject();
  route2: Subject<any> = new Subject();
  subroutes: Subject<any[]> = new Subject();

  progressSubject;

  mapControls = [];
  routeMap: any;
  mapRouter: any;
  formatter: any;
  openmap: any;

  pageLoaded = false;

  routeColors = ['red', 'green', 'blue', 'black', 'purple', 'gray', 'orange'];

  constructor(
    private route: ActivatedRoute,
    private businessTripsService: BusinessTripsService,
    private cdRef: ChangeDetectorRef,
    private wsService: WebSocketService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.errors = [];

    this.businessTripsService
      .getBusinessTrip(id)
      .pipe(
        switchMap((businessTrip: BusinessTrip) => {
          if (businessTrip.isProcessed && businessTrip.routes.length > 0) {
            return of({ type: 'businessTrip', data: businessTrip });
          } else {
            return this.wsService.connect(`ws://localhost:8000/ws/business_trip/${id}/`).pipe(map(data => ({ type: 'ws', data })));
          }
        })
      )
      .subscribe({
        next: (result: BusinessTripWSResponse) => {
          if (result.type === 'businessTrip') {
            this.pageLoaded = true;
            this.businessTrip = result.data as BusinessTrip;
          }
          if (result.type === 'ws') {
            const data: BusinessTripTask = result.data as BusinessTripTask;
            if (data.error) {
              this.pageLoaded = true;
              this.errors.push(data.message);
            }
          }
          console.log(result);
          this.cdRef.detectChanges();
        },
        error: err => console.log(err)
      });
    // this.businessTripsService
    //   .getBusinessTrip(id)
    //   .pipe(
    //     delay(1000),
    //     map(businessTrip => (this.businessTrip = businessTrip)),
    //     switchMap(businessTrip => {
    //       if (businessTrip.routes.length > 0) {
    //         return of(businessTrip);
    //       } else {
    //         return this.wsService.connect(`ws://localhost:8000/ws/business_trip/${id}/`).pipe(
    //           switchMap((message: any) => {
    //             if (message.message === 1) {
    //               return concat(this.businessTripsService.getBusinessTrip(id), EMPTY);
    //             } else {
    //               return of(message);
    //             }
    //           })
    //         );
    //       }
    //     })
    //   )
    //   .subscribe(data => {
    //     if (data.id) {
    //       this.businessTrip = data;
    //       for (let i = 0; i < this.businessTrip.duration; i++) {
    //         this.routes[i] = this.businessTrip.routes.filter(singleRoute => singleRoute.day === i);
    //       }
    //
    //       this.cdRef.detectChanges();
    //     } else {
    //       this.currentProgress = parseFloat(data.message);
    //       this.timeLeft = data.timeLeft;
    //       this.cdRef.detectChanges();
    //     }
    //     this.pageLoaded = true;
    //     this.cdRef.detectChanges();
    //   });
  }

  ngAfterViewChecked() {
    if (this.pageLoaded && !this.routeMap) {
      this.routeMap = new L.Map('map');

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

      this.updateMap({ value: this.selectedDay });
    }
  }

  ngOnDestroy(): void {
    if (this.progressSubject) {
      this.progressSubject.unsubscribe();
    }
  }

  updateMap(event: UpdateMapControl): void {
    let currentRoute;
    if (event.value === 'all') {
      currentRoute = this.routes;
    } else {
      currentRoute = [this.routes[+event.value]];
    }

    this.mapControls.forEach(mapControl => {
      mapControl.remove();
    });

    this.mapControls = [];

    currentRoute.forEach((subroute, subrouteIndex) => {
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
        show: subrouteIndex === 0
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

interface UpdateMapControl {
  source?: MatSelect;
  value: string;
}

interface BusinessTripWSResponse {
  type: string;
  data: BusinessTripTask | BusinessTrip;
}

interface BusinessTripTask {
  error: boolean;
  message: string;
}
