import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../shared/services/user.service';
import { Company } from '../companies/companies.service';
import { Observable, timer, EMPTY, defer, from, of } from 'rxjs';
import { Page, queryPaginated } from '../pagination';
import { environment } from 'src/environments/environment';
import { tap, mapTo, mergeMap } from 'rxjs/operators';
import { concat } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequistionsService {
  apiUrl = `${environment.apiUrl}api/requistions/`;
  perPage = 40;
  defaultHeaders = new HttpHeaders();

  constructor(private http: HttpClient, private userService: UserService) {}

  list(urlOrFilter?: string | object): Observable<Page<Requistion>> {
    return queryPaginated<Requistion>(this.http, this.defaultHeaders, this.apiUrl, this.perPage, urlOrFilter);
  }

  private fetchPage(url = `${this.apiUrl}?format=json&page=1&page_size=${this.perPage}`) {
    return this.http.get<Page<Requistion>>(url);
  }

  getRequistions(page?): Observable<any> {
    return defer(() => {
      const page$ = page ? page : `${this.apiUrl}?format=json&page=1&page_size=${this.perPage}`;
      return this.list(page$).pipe(
        mergeMap(({ results, next }) => {
          const results$ = from(results);
          const next$ = next ? this.getRequistions(next) : EMPTY;
          return concat(results$, next$);
        })
      );
    });
  }
}

export class Requistion {
  id: number;
  estimatedProfit: number;
  company: Company;
  assignmentDate: Date;
}
