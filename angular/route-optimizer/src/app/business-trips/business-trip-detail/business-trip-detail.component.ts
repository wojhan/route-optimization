import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessTripsService, BusinessTrip } from '../business-trips.service';
import { WebSocketService, WebSocketMessage } from 'src/app/shared/services/websocket.service';
import { switchMap, map } from 'rxjs/operators';
import { of, concat, EMPTY } from 'rxjs';

@Component({
  selector: 'app-business-trip-detail',
  templateUrl: './business-trip-detail.component.html',
  styleUrls: ['./business-trip-detail.component.scss']
})
export class BusinessTripDetailComponent implements OnInit, OnDestroy {
  businessTrip: BusinessTrip;

  currentProgress = 0;
  timeLeft;

  dir = null;
  dir1 = null;

  progressSubject;

  constructor(
    private route: ActivatedRoute,
    private businessTripsService: BusinessTripsService,
    private cdRef: ChangeDetectorRef,
    private wsService: WebSocketService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');

    this.businessTripsService
      .getBusinessTrip(id)
      .pipe(
        map(businessTrip => (this.businessTrip = businessTrip)),
        switchMap(businessTrip => {
          if (businessTrip.routes.length > 0) {
            return of(businessTrip);
          } else {
            return this.wsService.connect(`ws://localhost:8000/ws/business_trip/${id}/`).pipe(
              switchMap((message: any) => {
                if (message.message === 1) {
                  return concat(this.businessTripsService.getBusinessTrip(id), EMPTY);
                } else {
                  return of(message);
                }
              })
            );
          }
        })
      )
      .subscribe(data => {
        if (data.id) {
          this.businessTrip = data;
          const day1subroute = this.businessTrip.routes.filter(route => route.day === 0);
          const day2subroute = this.businessTrip.routes.filter(route => route.day === 1);

          this.dir = {};

          this.dir.origin = {
            lat: +day1subroute[0].startPoint.longitude.toFixed(7),
            lng: +day1subroute[0].startPoint.latitude.toFixed(7)
          };

          let waypoints = [];

          day1subroute.slice(1, day1subroute.length - 1).forEach((point, index) => {
            waypoints.push({
              location: {
                lat: +point.startPoint.longitude.toFixed(7),
                lng: +point.startPoint.latitude.toFixed(7)
              }
            });
          });

          this.dir.waypoints = waypoints;

          this.dir.destination = {
            lat: +day1subroute[day1subroute.length - 1].endPoint.longitude.toFixed(7),
            lng: +day1subroute[day1subroute.length - 1].endPoint.latitude.toFixed(7)
          };

          this.dir1 = {};

          this.dir1.origin = {
            lat: +day2subroute[0].startPoint.longitude.toFixed(7),
            lng: +day2subroute[0].startPoint.latitude.toFixed(7)
          };

          waypoints = [];

          day2subroute.slice(1, day2subroute.length - 1).forEach((point, index) => {
            waypoints.push({
              location: {
                lat: +point.startPoint.longitude.toFixed(7),
                lng: +point.startPoint.latitude.toFixed(7)
              }
            });
          });

          this.dir1.waypoints = waypoints;

          this.dir1.destination = {
            lat: +day2subroute[day2subroute.length - 1].endPoint.longitude.toFixed(7),
            lng: +day2subroute[day2subroute.length - 1].endPoint.latitude.toFixed(7)
          };
          this.cdRef.detectChanges();
        } else {
          this.currentProgress = parseFloat(data.message);
          this.timeLeft = data.timeLeft;
          this.cdRef.detectChanges();
        }
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.progressSubject) {
      this.progressSubject.unsubscribe();
    }
  }
}
