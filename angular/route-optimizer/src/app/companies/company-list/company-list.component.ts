import { Component, OnInit } from '@angular/core';
import { faInfoCircle, faTrash, faEdit, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { CompaniesService, Company } from '../companies.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Page } from 'src/app/pagination';
import { debounceTime, merge, startWith, switchMap, share } from 'rxjs/operators';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  faInfoCircle: IconDefinition = faInfoCircle;
  faThrash: IconDefinition = faTrash;
  faEdit: IconDefinition = faEdit;

  filterForm: FormGroup;
  page: Observable<Page<Company>>;
  pageUrl: Subject<string> = new Subject<string>();

  constructor(private companiesService: CompaniesService) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      search: new FormControl()
    });
    this.page = this.filterForm.valueChanges.pipe(
      debounceTime(200),
      startWith(this.filterForm.value),
      merge(this.pageUrl),
      switchMap(urlOrFilter => this.companiesService.list(urlOrFilter)),
      share()
    );
  }

  onPageChanged(page: string) {
    console.log(page);
    this.pageUrl.next(`http://localhost:8000/api/companies/?format=json&page=${page}&page_size=40`);
  }
}
