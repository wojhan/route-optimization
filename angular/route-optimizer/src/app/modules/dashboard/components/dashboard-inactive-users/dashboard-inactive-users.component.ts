import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, tap, map, share } from 'rxjs/operators';
import { IconDefinition, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { EmployeeService } from '@route-optimizer/core/services/employee.service';
import { User } from '@route-optimizer/core/models/User';
import { Page } from '@route-optimizer/core/models/Page';

@Component({
  selector: 'app-dashboard-inactive-users',
  templateUrl: './dashboard-inactive-users.component.html'
})
export class DashboardInactiveUsersComponent implements OnInit {
  faCheckCircle: IconDefinition = faCheckCircle;
  faTrash: IconDefinition = faTrash;

  inactiveUsers: InactiveUsers;

  constructor(private employeeService: EmployeeService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees(): void {
    const users: Observable<User[]> = this.employeeService.getInactiveEmployees(5).pipe(
      delay(1000),
      tap(() => (this.inactiveUsers.loading = false)),
      map((employees: Page<User>) => employees.results),
      share()
    );

    this.inactiveUsers = { employees: users, loading: true };
    this.cdRef.detectChanges();
  }

  activateEmployee(id: number): void {
    this.employeeService.activateEmployee(id).subscribe({
      next: () => this.getEmployees()
    });
  }

  deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => this.getEmployees()
    });
  }
}

interface InactiveUsers {
  employees: Observable<User[]>;
  loading: boolean;
}
