import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../shared/services/user.service';
import { Company } from '../companies/companies.service';
import { concat, defer, EMPTY, from, Observable } from 'rxjs';
import { Page, queryPaginated } from '../pagination';
import { environment } from 'src/environments/environment';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequistionsService {
  private apiRequisitionsUrl = `${environment.apiUrl}api/requisitions`;
  private apiEmployeesUrl = `${environment.apiUrl}api/employees/`;
  private perPage = environment.defaultPaginationSize;

  constructor(private http: HttpClient, private userService: UserService) {}

  public getApiRequisitionsPageUrl(page?: string): string {
    return this.apiRequisitionsUrl + `?page=${page ? page : 1}&page_size=${this.perPage}`;
  }

  list(urlOrFilter?: string | object): Observable<Page<Requisition>> {
    return queryPaginated<Requisition>(this.http, new HttpHeaders(), this.apiRequisitionsUrl, this.perPage, urlOrFilter);
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
    return this.userService.isStaff.getValue() || requisition.createdBy === this.userService.user.getValue().id;
  }
}

export class Requisition {
  id: number;
  estimatedProfit: number;
  company: Company;
  assignmentDate: Date;
  createdBy: number;
}
