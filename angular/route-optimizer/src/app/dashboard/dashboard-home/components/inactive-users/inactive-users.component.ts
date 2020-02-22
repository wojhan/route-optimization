import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Employee, EmployeesService } from 'src/app/employees/employees.service';
import { Observable } from 'rxjs';
import { Page } from 'src/app/pagination';
import { delay, tap, map, share } from 'rxjs/operators';
import { IconDefinition, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-inactive-users',
  templateUrl: './inactive-users.component.html',
  styleUrls: ['./inactive-users.component.scss']
})
export class InactiveUsersComponent implements OnInit {
  faCheckCircle: IconDefinition = faCheckCircle;
  faTrash: IconDefinition = faTrash;

  inactiveUsers: InactiveUsers;

  constructor(private employeesService: EmployeesService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees(): void {
    const users: Observable<Employee[]> = this.employeesService.getInactiveEmployees().pipe(
      delay(1000),
      tap(() => (this.inactiveUsers.loading = false)),
      map((employees: Page<Employee>) => employees.results),
      share()
    );

    this.inactiveUsers = { employees: users, loading: true };
    this.cdRef.detectChanges();
  }

  activateEmployee(id: number): void {
    this.employeesService.activateEmployee(id).subscribe({
      next: () => this.getEmployees()
    });
  }

  deleteEmployee(id: number): void {
    this.employeesService.deleteEmployee(id).subscribe({
      next: () => this.getEmployees()
    });
  }
}

interface InactiveUsers {
  employees: Observable<Employee[]>;
  loading: boolean;
}
