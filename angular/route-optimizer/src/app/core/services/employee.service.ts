import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { concat, defer, EMPTY, from, Observable } from 'rxjs';
import { Page } from '../models/Page';
import { User } from '../models/User';
import { queryPaginated } from '../helpers/pagination';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiEmployeesUrl = `${environment.apiUrl}api/employees/`;
  private apiUsersUrl = `${environment.apiUrl}api/users/`;

  public perPage = environment.defaultPaginationSize;

  constructor(private http: HttpClient) {}

  list(urlOrFilter?: string | object, pageSize?: number): Observable<Page<User>> {
    return queryPaginated<User>(this.http, this.apiEmployeesUrl, pageSize ? pageSize : this.perPage, urlOrFilter);
  }

  getEmployee(employeeId: number): Observable<User> {
    const url = this.apiEmployeesUrl + `${employeeId}/`;
    return this.http.get<User>(url);
  }

  getInactiveEmployees(employeePageSize?: number): Observable<Page<User>> {
    return this.list({ is_active: false }, employeePageSize);
  }

  getEmployees(urlOrFilter: string | any): Observable<User> {
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

  activateEmployee(employeeId: number): Observable<User> {
    const url = this.apiUsersUrl + `${employeeId}/`;
    const body = { isActive: true };
    return this.http.patch<User>(url, body);
  }

  deActivateEmployee(employeeId: number): Observable<User> {
    const url = this.apiUsersUrl + `${employeeId}/`;
    const body = { isActive: false };
    return this.http.patch<User>(url, body);
  }

  deleteEmployee(employeeId: number): Observable<any> {
    const url = this.apiUsersUrl + `${employeeId}/`;
    return this.http.delete(url);
  }
}
