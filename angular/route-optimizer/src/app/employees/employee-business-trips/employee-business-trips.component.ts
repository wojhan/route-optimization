import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessTripsService, BusinessTrip } from 'src/app/business-trips/business-trips.service';

@Component({
  selector: 'app-employee-business-trips',
  templateUrl: './employee-business-trips.component.html',
  styleUrls: ['./employee-business-trips.component.scss']
})
export class EmployeeBusinessTripsComponent implements OnInit {
  businessTrip: BusinessTrip;

  dir = null;
  dir1 = null;

  constructor(private route: ActivatedRoute, private businessTripsService: BusinessTripsService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('businessTripId');
    // this.businessTripsService.getBusinessTrip(id).subscribe(businessTrip => {
    //   this.businessTrip = businessTrip;

    //   const day1subroute = this.businessTrip.routes.filter(route => route.day === 0);
    //   const day2subroute = this.businessTrip.routes.filter(route => route.day === 1);

    //   this.dir = {};

    //   this.dir.origin = {
    //     lat: +day1subroute[0].startPoint.longitude.toFixed(7),
    //     lng: +day1subroute[0].startPoint.latitude.toFixed(7)
    //   };

    //   let waypoints = [];

    //   day1subroute.slice(1, day1subroute.length - 1).forEach((point, index) => {
    //     waypoints.push({
    //       location: {
    //         lat: +point.startPoint.longitude.toFixed(7),
    //         lng: +point.startPoint.latitude.toFixed(7)
    //       }
    //     });
    //   });

    //   this.dir.waypoints = waypoints;

    //   this.dir.destination = {
    //     lat: +day1subroute[day1subroute.length - 1].endPoint.longitude.toFixed(7),
    //     lng: +day1subroute[day1subroute.length - 1].endPoint.latitude.toFixed(7)
    //   };

    //   this.dir1 = {};

    //   this.dir1.origin = {
    //     lat: +day2subroute[0].startPoint.longitude.toFixed(7),
    //     lng: +day2subroute[0].startPoint.latitude.toFixed(7)
    //   };

    //   waypoints = [];

    //   day2subroute.slice(1, day2subroute.length - 1).forEach((point, index) => {
    //     waypoints.push({
    //       location: {
    //         lat: +point.startPoint.longitude.toFixed(7),
    //         lng: +point.startPoint.latitude.toFixed(7)
    //       }
    //     });
    //   });

    //   this.dir1.waypoints = waypoints;

    //   this.dir1.destination = {
    //     lat: +day2subroute[day2subroute.length - 1].endPoint.longitude.toFixed(7),
    //     lng: +day2subroute[day2subroute.length - 1].endPoint.latitude.toFixed(7)
    //   };

    //   this.cdRef.detectChanges();

    //   console.log(this.dir.origin);
    //   console.log(this.dir.waypoints);
    //   console.log(this.dir.destination);

    //   console.log(this.businessTrip);
    // });
  }
}
