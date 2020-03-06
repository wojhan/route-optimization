import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Employee, EmployeesService } from '../employees.service';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { debounceTime, startWith, switchMap, share, delay, concatMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Page } from 'src/app/pagination';
import { IconDefinition, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  faEllipsisV: IconDefinition = faEllipsisV;

  activeEmployeeFilterForm: FormGroup;
  inactiveEmployeeFilterForm: FormGroup;

  activeEmployeePage: Observable<Page<Employee>>;
  inactiveEmployeePage: Observable<Page<Employee>>;

  activeEmployeePageUrl: BehaviorSubject<string>;
  inactiveEmployeePageUrl: BehaviorSubject<string>;

  constructor(private employeesService: EmployeesService, public dialog: MatDialog) {}

  ngOnInit() {
    this.inactiveEmployeeFilterForm = new FormGroup({
      search: new FormControl()
    });

    this.activeEmployeeFilterForm = new FormGroup({
      search: new FormControl()
    });

    const pageSize = this.employeesService.perPage;
    this.activeEmployeePageUrl = new BehaviorSubject(`${environment.apiUrl}api/employees/?page=1&page_size=${pageSize}`);
    this.inactiveEmployeePageUrl = new BehaviorSubject(`${environment.apiUrl}api/employees/?is_active=false&page=1&page_size=${pageSize}`);

    this.activeEmployeePage = merge(
      this.activeEmployeeFilterForm.valueChanges.pipe(debounceTime(200), startWith(this.activeEmployeeFilterForm.value)),
      this.activeEmployeePageUrl
    ).pipe(
      switchMap(urlOrFilter => this.employeesService.list(urlOrFilter)),
      share()
    );

    this.inactiveEmployeePage = merge(
      this.inactiveEmployeeFilterForm.valueChanges.pipe(debounceTime(200), startWith(this.inactiveEmployeeFilterForm.value)),
      this.inactiveEmployeePageUrl
    ).pipe(
      switchMap(urlOrFilter => this.employeesService.list(urlOrFilter)),
      share()
    );
  }

  onActiveEmployeesPageChanged(page: string) {
    this.activeEmployeePageUrl.next(page);
    this.inactiveEmployeePageUrl.next(this.inactiveEmployeePageUrl.getValue());
  }

  onInactiveEmployeesPageChanged(page: string) {
    this.inactiveEmployeePageUrl.next(page);
    this.activeEmployeePageUrl.next(this.activeEmployeePageUrl.getValue());
  }
}
