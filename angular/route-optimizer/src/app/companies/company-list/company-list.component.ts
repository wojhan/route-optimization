import { Component, OnInit } from '@angular/core';
import { faInfoCircle, faTrash, faEdit, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { CompaniesService, Company } from '../companies.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  faInfoCircle: IconDefinition = faInfoCircle;
  faThrash: IconDefinition = faTrash;
  faEdit: IconDefinition = faEdit;
  companies: Company[];
  pageOfItems: Array<any>;

  constructor(private companiesService: CompaniesService) {}

  ngOnInit() {
    this.companiesService.getAllCompanies().subscribe(companies => (this.companies = companies));
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
