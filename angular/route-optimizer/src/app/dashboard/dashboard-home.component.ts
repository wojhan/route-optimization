import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  Output,
  EventEmitter,
  Input
} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserService } from "../shared/services/user.service";

@Component({
  selector: "app-dashboard-home",
  templateUrl: "./dashboard-home.component.html",
  styleUrls: ["./dashboard-home.component.scss"]
})
export class DashboardHomeComponent implements OnInit, OnChanges {
  lat = 53.13336;
  lng = 23.1467987;

  public dir = undefined;
  public dir1 = undefined;

  constructor(
    public http: HttpClient,
    public userService: UserService,
    public cdRef: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  public test(event) {
    console.log(event);
  }

  ngOnInit() {
    this.http
      .get("http://localhost:8000/api/route", {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Token ${this.userService.token}`
        }),
        responseType: "json"
      })
      .subscribe((data: any) => {
        const routes = JSON.parse(data);
        console.log(routes);
        const correct_route = routes[1][0].route;
        const start_route = routes[0][0].route;

        console.log(routes);
        console.log(routes);

        let waypoints = [];
        for (let i = 1; i < start_route.length - 1; i++) {
          waypoints.push({
            location: {
              lat: +start_route[i].coords.lng.toFixed(7),
              lng: +start_route[i].coords.lat.toFixed(7)
            }
          });
        }

        this.dir = {};
        this.dir.waypoints = waypoints;
        this.dir.origin = {
          lat: +start_route[0].coords.lng.toFixed(7),
          lng: +start_route[0].coords.lat.toFixed(7)
        };

        this.dir.destination = {
          lat: +start_route[start_route.length - 1].coords.lng.toFixed(7),
          lng: +start_route[start_route.length - 1].coords.lat.toFixed(7)
        };

        waypoints = [];
        for (let i = 1; i < correct_route.length - 1; i++) {
          waypoints.push({
            location: {
              lat: +correct_route[i].coords.lng.toFixed(7),
              lng: +correct_route[i].coords.lat.toFixed(7)
            }
          });
        }

        this.dir1 = {};
        this.dir1.waypoints = waypoints;
        this.dir1.origin = {
          lat: +correct_route[0].coords.lng.toFixed(7),
          lng: +correct_route[0].coords.lat.toFixed(7)
        };

        this.dir1.destination = {
          lat: +correct_route[correct_route.length - 1].coords.lng.toFixed(7),
          lng: +correct_route[correct_route.length - 1].coords.lat.toFixed(7)
        };

        this.cdRef.detectChanges();
      });
  }
}
