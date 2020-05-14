import { Component, OnInit } from '@angular/core';
import { IconDefinition, faTachometerAlt, faBuilding, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.page.html'
})
export class UserDashboardPage implements OnInit {
  faTachometerAlt: IconDefinition = faTachometerAlt;
  faBuilding: IconDefinition = faBuilding;
  faMoneyBillWave: IconDefinition = faMoneyBillWave;
  constructor() {}

  ngOnInit() {}
}
