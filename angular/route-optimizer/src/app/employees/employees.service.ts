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
  perPage = 40;
  defaultHeaders = new HttpHeaders();

  constructor(private readonly http: HttpClient, private readonly userService: UserService) {}

  list(urlOrFilter?: string | object): Observable<Page<Employee>> {
    return queryPaginated<Employee>(this.http, this.defaultHeaders, this.apiUrl, this.perPage, urlOrFilter);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}${id}/`);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}`, employee);
  }

  editEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}${employee.id}/`, employee);
  }

  deleteEmployee(employeeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${employeeId}/`);
  }
}

export class Employee {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}
