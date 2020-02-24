import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { IconDefinition, faTachometerAlt, faBuilding, faMoneyBillWave, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  faTachometerAlt: IconDefinition = faTachometerAlt;
  faBuilding: IconDefinition = faBuilding;
  faMoneyBillWave: IconDefinition = faMoneyBillWave;
  faUsers: IconDefinition = faUsers;
  constructor(private dashboardService: DashboardService) {}

  @Input()
  public isStaff;

  ngOnInit() {}
}
