import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessTrip } from '../business-trips/business-trips.service';

@Component({
  selector: 'app-my-business-trips',
  templateUrl: './my-business-trips.component.html',
  styleUrls: ['./my-business-trips.component.scss']
})
export class MyBusinessTripsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

export interface TimeDependentBusinessTrip {
  businessTrip: Observable<BusinessTrip[]>;
  loading: boolean;
}
