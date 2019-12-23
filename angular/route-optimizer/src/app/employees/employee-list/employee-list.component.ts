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

  filterForm: FormGroup;
  page: Observable<Page<Employee>>;
  pageUrl: BehaviorSubject<string> = new BehaviorSubject<string>(`${environment.apiUrl}api/employees/?format=json&page=1&page_size=40`);

  constructor(private employeesService: EmployeesService, private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      search: new FormControl()
    });

    this.page = merge(this.filterForm.valueChanges.pipe(debounceTime(200), startWith(this.filterForm.value)), this.pageUrl).pipe(
      switchMap(urlOrFilter => this.employeesService.list(urlOrFilter)),
      share()
    );

    this.page.subscribe(data => console.log(data));
  }

  remove(employee: Employee): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '250px',
      data: {
        content: `Czy na pewno chcesz usunąć pracownika ${employee.firstName} ${employee.lastName}?`,
        ok: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeesService.deleteEmployee(employee.id).subscribe(data => {
          this.onPageChanged(this.pageUrl.getValue());
        });
      }
    });
  }

  onPageChanged(page: string) {
    this.pageUrl.next(`${environment.apiUrl}api/employees/?format=json&page=${page}&page_size=40`);
  }
}
