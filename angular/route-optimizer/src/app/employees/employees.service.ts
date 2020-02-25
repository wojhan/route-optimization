import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { queryPaginated, Page } from '../pagination';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  apiUrl = `${environment.apiUrl}api/employees/`;
  usersApiUrl = `${environment.apiUrl}api/users/`;
  inactiveEmployeesApiUrl = `${environment.apiUrl}api/inactive-employees/`;
  perPage = 40;
  defaultHeaders = new HttpHeaders();

  constructor(private readonly http: HttpClient, private readonly userService: UserService) {}

  list(baseUrl?: string, urlOrFilter?: string | object): Observable<Page<Employee>> {
    if (baseUrl === undefined) {
      baseUrl = this.apiUrl;
    }
    return queryPaginated<Employee>(this.http, this.defaultHeaders, baseUrl, this.perPage, urlOrFilter);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}${id}/`);
  }

  getInactiveEmployees(): Observable<Page<Employee>> {
    return queryPaginated<Employee>(this.http, this.defaultHeaders, this.inactiveEmployeesApiUrl, 5);
  }

  activateEmployee(employeeId: number): Observable<Employee> {
    const body = { isActive: true };
    return this.http.patch<Employee>(`${this.usersApiUrl}${employeeId}/`, body);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}`, employee);
  }

  editEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.usersApiUrl}${employee.id}/`, employee);
  }

  deleteEmployee(employeeId: number): Observable<any> {
    return this.http.delete(`${this.usersApiUrl}${employeeId}/`);
  }
}

export class Employee {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}
