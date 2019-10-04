import { Component, OnInit } from '@angular/core';
import { Company, DashboardService } from '../../dashboard.service';
import { faInfoCircle, faTrash, faEdit, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-company-list',
  templateUrl: './dashboard-company-list.component.html',
  styleUrls: ['./dashboard-company-list.component.scss']
})
export class DashboardCompanyListComponent implements OnInit {
  faInfoCircle: IconDefinition = faInfoCircle;
  faThrash: IconDefinition = faTrash;
  faEdit: IconDefinition = faEdit;
  companies: Company[];
  pageOfItems: Array<any>;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getAllCompanies().subscribe(companies => (this.companies = companies));
    // an example array of 150 items to be paged
    // this.items = Array(150)
    //   .fill(0)
    //   .map((x, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }
}
