import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concat, defer, EMPTY, from, Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { environment } from '@route-optimizer/environment/environment';
import { Page } from '../models/Page';
import { Company } from '../models/Company';
import { queryPaginated } from '../helpers/pagination';
import { CompanyHistory } from '../models/CompanyHistory';
import { AuthenticationService } from '@route-optimizer/core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiCompaniesUrl = `${environment.apiUrl}api/companies/`;
  private perPage = environment.defaultPaginationSize;

  constructor(private authenticationService: AuthenticationService, private http: HttpClient) {}

  list(urlOrFilter?: string | object): Observable<Page<Company>> {
    return queryPaginated<Company>(this.http, this.apiCompaniesUrl, this.perPage, urlOrFilter);
  }

  getCompany(companyId: number): Observable<Company> {
    const url = this.apiCompaniesUrl + `${companyId}/`;
    return this.http.get<Company>(url);
  }

  getCompanies(urlOrFilter: string | any): Observable<Company> {
    if (!urlOrFilter || !urlOrFilter.search) {
      return EMPTY;
    }

    let page = urlOrFilter;

    if (urlOrFilter instanceof Object) {
      page = this.apiCompaniesUrl + `?search=${urlOrFilter.search}`;
    }

    return defer(() => {
      return this.list(page).pipe(
        mergeMap(({ results, next }) => {
          const results$ = from(results);
          const next$ = next ? this.getCompanies(next) : EMPTY;
          return concat(results$, next$);
        })
      );
    });
  }

  getUserHistory(companyId: number): Observable<CompanyHistory[]> {
    const userId = this.authenticationService.currentUser.getValue().id;
    const url = this.apiCompaniesUrl + `${companyId}/employee/${userId}/`;

    return this.http.get<CompanyHistory[]>(url);
  }

  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(this.apiCompaniesUrl, company);
  }

  editCompany(company: Company): Observable<Company> {
    const url = this.apiCompaniesUrl + `${company.id}/`;
    return this.http.put<Company>(url, company);
  }

  deleteCompany(companyId: number): Observable<any> {
    const url = this.apiCompaniesUrl + `${companyId}/`;
    return this.http.delete(url);
  }

  canEdit(company: Company): boolean {
    // TODO: After api's change adjust this depending on new json data.
    return true;
  }
}
