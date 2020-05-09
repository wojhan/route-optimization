import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-business-trips-page',
  templateUrl: './business-trips.page.html'
})
export class BusinessTripsPage implements OnInit {
  @HostBinding('class') classes = 'fluid-content-wrapper';
  constructor() {}

  ngOnInit() {}
}
