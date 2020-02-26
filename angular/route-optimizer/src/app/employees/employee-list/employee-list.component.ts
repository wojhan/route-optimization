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

  activeEmployeePageUrl: BehaviorSubject<string> = new BehaviorSubject<string>(
    `${environment.apiUrl}api/employees/?format=json&page=1&page_size=40`
  );
  inactiveEmployeePageUrl: BehaviorSubject<string> = new BehaviorSubject<string>(
    `${environment.apiUrl}api/inactive-employees/?format=json&page=1&page_size=40`
  );

  constructor(private employeesService: EmployeesService, public dialog: MatDialog) {}

  ngOnInit() {
    this.inactiveEmployeeFilterForm = new FormGroup({
      search: new FormControl()
    });

    this.activeEmployeeFilterForm = new FormGroup({
      search: new FormControl()
    });

    this.activeEmployeePage = merge(
      this.activeEmployeeFilterForm.valueChanges.pipe(debounceTime(200), startWith(this.activeEmployeeFilterForm.value)),
      this.activeEmployeePageUrl
    ).pipe(
      switchMap(urlOrFilter => this.employeesService.list(this.activeEmployeePageUrl.getValue(), urlOrFilter)),
      share()
    );

    this.inactiveEmployeePage = merge(
      this.inactiveEmployeeFilterForm.valueChanges.pipe(debounceTime(200), startWith(this.inactiveEmployeeFilterForm.value)),
      this.inactiveEmployeePageUrl
    ).pipe(
      switchMap(urlOrFilter => this.employeesService.list(this.inactiveEmployeePageUrl.getValue(), urlOrFilter)),
      share()
    );
  }

  remove(employee: Employee): void {
    // const dialogRef = this.dialog.open(DeleteModalComponent, {
    //   width: '250px',
    //   data: {
    //     content: `Czy na pewno chcesz usunąć pracownika ${employee.firstName} ${employee.lastName}?`,
    //     ok: true
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.employeesService.deleteEmployee(employee.id).subscribe(data => {
    //       this.onPageChanged(this.pageUrl.getValue());
    //     });
    //   }
    // });
  }

  onActiveEmployeesPageChanged(page: string) {
    // this.activeEmployeePageUrl.next(`${environment.apiUrl}api/employees/?format=json&page=${page}&page_size=40`);
    this.activeEmployeePageUrl.next(page);
    this.inactiveEmployeePageUrl.next(this.inactiveEmployeePageUrl.getValue());
  }

  onInactiveEmployeesPageChanged(page: string) {
    // this.inactiveEmployeePageUrl.next(`${environment.apiUrl}api/inactive-employees/?format=json&page=${page}&page_size=40`);
    this.inactiveEmployeePageUrl.next(page);
    this.activeEmployeePageUrl.next(this.activeEmployeePageUrl.getValue());
  }
}
