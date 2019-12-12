import { Component, OnInit } from '@angular/core';
import { IconDefinition, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { Page } from 'src/app/pagination';
import { Employee } from '../../employees.service';
import { environment } from 'src/environments/environment';
import { BusinessTripsService, BusinessTrip } from 'src/app/business-trips/business-trips.service';
import { debounceTime, startWith, switchMap, share } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-business-trips-list',
  templateUrl: './employee-business-trips-list.component.html',
  styleUrls: ['./employee-business-trips-list.component.scss']
})
export class EmployeeBusinessTripsListComponent implements OnInit {
  faEllipsisV: IconDefinition = faEllipsisV;

  filterForm: FormGroup;
  page: Observable<Page<BusinessTrip>>;
  pageUrl: BehaviorSubject<string>;
  employeeId: number;

  constructor(private businessTripsService: BusinessTripsService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.employeeId = +this.route.snapshot.paramMap.get('employeeId');
    this.pageUrl = new BehaviorSubject<string>(
      `${environment.apiUrl}api/employees/${this.employeeId}/business-trips/?format=json&page=1&page_size=40`
    );

    console.log(this.employeeId);

    this.filterForm = new FormGroup({
      search: new FormControl()
    });

    this.page = merge(this.filterForm.valueChanges.pipe(debounceTime(200), startWith(this.filterForm.value)), this.pageUrl).pipe(
      switchMap(urlOrFilter => this.businessTripsService.list(this.employeeId, urlOrFilter)),
      share()
    );

    this.page.subscribe(data => console.log(data));
  }

  onPageChanged(page: string): void {
    this.pageUrl.next(`${environment.apiUrl}api/employees/${this.employeeId}/business-trips/?format=json&page=${page}&page_size=40`);
  }
}
