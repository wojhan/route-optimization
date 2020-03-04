import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Page, queryPaginated } from '../pagination';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { concat, defer, EMPTY, from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private apiEmployeesUrl = `${environment.apiUrl}api/employees/`;
  private apiUsersUrl = `${environment.apiUrl}api/users/`;

  public perPage = environment.defaultPaginationSize;

  constructor(private readonly http: HttpClient) {}

  list(urlOrFilter?: string | object): Observable<Page<Employee>> {
    return queryPaginated<Employee>(this.http, new HttpHeaders(), this.apiEmployeesUrl, this.perPage, urlOrFilter);
  }

  getEmployee(id: number): Observable<Employee> {
    const url = this.apiEmployeesUrl + `${id}/`;
    return this.http.get<Employee>(url);
  }

  getEmployees(urlOrFilter: string | any): Observable<Employee> {
    if (!urlOrFilter || !urlOrFilter.search) {
      return EMPTY;
    }

    let page = urlOrFilter;

    if (urlOrFilter instanceof Object) {
      page = `${this.apiEmployeesUrl}?search=${urlOrFilter.search}`;
    }

    return defer(() => {
      return this.list(page).pipe(
        mergeMap(({ results, next }) => {
          const results$ = from(results);
          const next$ = next ? this.getEmployees(next) : EMPTY;
          return concat(results$, next$);
        })
      );
    });
  }

  getInactiveEmployees(employeeNumber?: number): Observable<Page<Employee>> {
    const url = `${this.apiEmployeesUrl}?is_active=false`;
    return queryPaginated<Employee>(this.http, new HttpHeaders(), url, employeeNumber ? employeeNumber : this.perPage);
  }

  activateEmployee(employeeId: number): Observable<Employee> {
    const url = this.apiUsersUrl + `${employeeId}/`;
    const body = { isActive: true };
    return this.http.patch<Employee>(url, body);
  }

  deActivateEmployee(employeeId: number): Observable<Employee> {
    const url = this.apiUsersUrl + `${employeeId}/`;
    const body = { isActive: false };
    return this.http.patch<Employee>(url, body);
  }

  editEmployee(employeeId: number, employee: Employee): Observable<Employee> {
    const url = this.apiUsersUrl + `${employeeId}/`;
    return this.http.patch<Employee>(url, employee);
  }

  deleteEmployee(employeeId: number): Observable<any> {
    const url = this.apiUsersUrl + `${employeeId}/`;
    return this.http.delete(url);
  }
}

export class Employee {
  dateJoined: string;
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: string;
}
