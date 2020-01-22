import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}

  @Input()
  public isStaff;

  ngOnInit() {}
}
