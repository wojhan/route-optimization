import { Component, Input, OnInit } from '@angular/core';
import { faBuilding, faMoneyBillWave, faTachometerAlt, faUsers, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  faTachometerAlt: IconDefinition = faTachometerAlt;
  faBuilding: IconDefinition = faBuilding;
  faMoneyBillWave: IconDefinition = faMoneyBillWave;
  faUsers: IconDefinition = faUsers;

  constructor() {}

  @Input()
  public isStaff;

  ngOnInit() {}
}
