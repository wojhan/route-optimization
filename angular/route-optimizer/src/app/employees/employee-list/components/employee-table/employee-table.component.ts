import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IconDefinition, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Page } from 'src/app/pagination';
import { Employee, EmployeesService } from 'src/app/employees/employees.service';
import { environment } from 'src/environments/environment';
import { UpdateProfileModalComponent } from 'src/app/dashboard/dashboard-home/components/update-profil-modal/update-profile-modal.component';
import { MatDialog } from '@angular/material';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { filter, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss']
})
export class EmployeeTableComponent implements OnInit {
  faEllipsisV: IconDefinition = faEllipsisV;

  @Input()
  filterForm: FormGroup;

  @Input()
  page: Observable<Page<Employee>>;

  @Input()
  pageUrl: BehaviorSubject<string>;

  @Output()
  pageChanged: EventEmitter<string> = new EventEmitter();

  constructor(private employeesService: EmployeesService, private dialog: MatDialog) {}

  ngOnInit() {}

  onPageChanged(page: string) {
    console.log(page);
    this.pageChanged.emit(page);
  }

  private changeActiveStatus(employeeId: number, isActive: boolean): void {
    let result;
    if (isActive) {
      result = this.employeesService.activateEmployee(employeeId);
    } else {
      result = this.employeesService.deActivateEmployee(employeeId);
    }

    result.subscribe({
      next: () => {
        this.onPageChanged(this.pageUrl.getValue());
      }
    });
  }

  activateEmployee(employeeId: number): void {
    this.changeActiveStatus(employeeId, true);
  }

  deactivateEmployee(employeeId: number): void {
    this.changeActiveStatus(employeeId, false);
  }

  editEmployee(employee: Employee) {
    const profileForm = new FormGroup({
      firstName: new FormControl(employee.firstName, [Validators.required]),
      lastName: new FormControl(employee.lastName, [Validators.required]),
      email: new FormControl(employee.email, [Validators.required, Validators.email])
    });

    const dialogRef = this.dialog.open(UpdateProfileModalComponent, {
      width: '400px',
      data: {
        profileForm
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeesService.editEmployee(employee.id, result.value).subscribe({
          next: () => {
            this.onPageChanged(this.pageUrl.getValue());
          }
        });
        // this.userService.updateProfile(result.value).subscribe(data => {
        //   this.userService.user.next(data);
        // });
      }
    });
  }

  deleteEmployee(employee: Employee) {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '250px',
      data: {
        content: `Czy na pewno chcesz usunąć pracownika ${employee.firstName} ${employee.lastName}?`,
        ok: true
      }
    });

    const dialogClosed: Observable<number> = dialogRef.afterClosed().pipe(
      filter(result => result !== undefined),
      map(() => employee.id)
    );
    const deleteEmployee = dialogClosed.pipe(switchMap((id: number) => this.employeesService.deleteEmployee(id)));

    deleteEmployee.subscribe({
      next: () => {
        this.onPageChanged(this.pageUrl.getValue());
      }
    });
  }
}
