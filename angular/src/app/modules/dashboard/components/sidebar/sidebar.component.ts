import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    // this.isHidden = new EventEmitter<boolean>();
    // const isHidden = localStorage.getItem('isSidebarHidden');
    // console.log('sidebar');
    // console.log(isHidden);
    // if (!isHidden) {
    //   localStorage.setItem('isSidebarHidden', 'false');
    //   this.dashboardService.setIsSidebarHidden(false);
    // } else {
    //   this.dashboardService.setIsSidebarHidden(isHidden === 'false' ? false : true);
    //   // this.isHidden.emit(this.isHiddenValue);
    // }
    // console.log(this.dashboardService.getIsSidebarHidden());
  }
}
