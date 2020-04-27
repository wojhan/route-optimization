import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Requisition } from '../models/Requisition';
import { Page } from '../models/Page';
import { concat, defer, EMPTY, from, Observable } from 'rxjs';
import { queryPaginated } from '../helpers/pagination';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {
  private apiRequisitionsUrl = `${environment.apiUrl}api/requisitions/`;
  private apiEmployeesUrl = `${environment.apiUrl}api/employees/`;
  private perPage = environment.defaultPaginationSize;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {}

  public getApiRequisitionsPageUrl(page?: string): string {
    return this.apiRequisitionsUrl + `?page=${page ? page : 1}&page_size=${this.perPage}`;
  }

  list(urlOrFilter?: string | object, employeeId?: number, pageSize?: number): Observable<Page<Requisition>> {
    let baseUrl = this.apiRequisitionsUrl;
    if (employeeId) {
      baseUrl = this.apiEmployeesUrl + `${employeeId}/requisitions`;
    }
    if (urlOrFilter === null) {
      urlOrFilter = {};
    }
    return queryPaginated<Requisition>(this.http, baseUrl, pageSize ? pageSize : this.perPage, urlOrFilter);
  }

  getRequisitions(employeeId, page?): Observable<any> {
    return defer(() => {
      const url = this.apiEmployeesUrl + `${employeeId}/requisitions/`;
      const page$ = page ? page : url;
      return this.list(page$).pipe(
        mergeMap(({ results, next }) => {
          const results$ = from(results);
          const next$ = next ? this.getRequisitions(employeeId, next) : EMPTY;
          return concat(results$, next$);
        })
      );
    });
  }

  addRequisition(requisition: Requisition): Observable<Requisition> {
    return this.http.post<Requisition>(this.apiRequisitionsUrl, requisition);
  }

  updateRequisition(requisition: Requisition): Observable<Requisition> {
    const url = this.apiRequisitionsUrl + `${requisition.id}/`;
    return this.http.put<Requisition>(url, requisition);
  }

  deleteRequisition(requisitionId: number): Observable<any> {
    const url = this.apiRequisitionsUrl + `${requisitionId}/`;
    return this.http.delete(url);
  }

  canEditRequisition(requisition: Requisition): boolean {
    return true;
    // return this.userService.isStaff.getValue() || requisition.createdBy === this.userService.user.getValue().id;
  }
}
