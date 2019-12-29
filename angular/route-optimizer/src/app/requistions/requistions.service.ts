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

  constructor(private http: HttpClient, private userService: UserService) {}

  list(urlOrFilter?: string | object): Observable<Page<Requistion>> {
    return queryPaginated<Requistion>(this.http, this.apiUrl, this.perPage, urlOrFilter);
  }

  private fetchPage(url = `${this.apiUrl}?format=json&page=1&page_size=${this.perPage}`) {
    return this.http.get<Page<Requistion>>(url, {
      headers: new HttpHeaders({
        Authorization: `Token ${this.userService.token}`
      })
    });
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

  //   // simulate network request
  // function fetchPage(page=0) {
  //   return timer(100).pipe(
  //     tap(() => console.log(`-> fetched page ${page}`)),
  //     mapTo({
  //       items: Array.from({ length: 10 }).map((_, i) => page * 10 + i),
  //       nextPage: page + 1,
  //     })
  //   );
  // }

  // const getItems = page => defer(() => fetchPage(page)).pipe(
  //   mergeMap(({ items, nextPage }) => {
  //     const items$ = from(items);
  //     const next$ = nextPage ? getItems(nextPage) : EMPTY;
  //     return concat(items$, next$);
  //   })
  // );

  // // process only first 30 items, without fetching all of the data
  // getItems()
  //  .pipe(take(30))
  //  .subscribe(e => console.log(e));
}

export class Requistion {
  id: number;
  estimatedProfit: number;
  company: Company;
  assignmentDate: Date;
}
