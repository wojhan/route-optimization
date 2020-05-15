import { Component, OnInit } from '@angular/core';
import { IconDefinition, faBuilding, faMoneyBillWave, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-base-layout-user-sidebar',
  templateUrl: './base-layout-user-sidebar.component.html'
})
export class BaseLayoutUserSidebarComponent implements OnInit {
  faTachometerAlt: IconDefinition = faTachometerAlt;
  faBuilding: IconDefinition = faBuilding;
  faMoneyBillWave: IconDefinition = faMoneyBillWave;
  constructor() {}

  ngOnInit() {}
}
