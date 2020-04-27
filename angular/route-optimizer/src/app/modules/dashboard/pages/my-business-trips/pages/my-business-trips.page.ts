import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessTrip } from '../../../../../core/models/BusinessTrip';

@Component({
  selector: 'app-my-business-trips',
  templateUrl: './my-business-trips.page.html'
})
export class MyBusinessTripsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}

export interface TimeDependentBusinessTrip {
  businessTrip: Observable<BusinessTrip[]>;
  loading: boolean;
}
