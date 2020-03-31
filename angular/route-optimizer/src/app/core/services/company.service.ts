import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { concat, defer, EMPTY, from, Observable, of } from 'rxjs';
import { Page } from '../models/Page';
import { Company } from '../models/Company';
import { queryPaginated } from '../helpers/pagination';
import { mergeMap } from 'rxjs/operators';
import { CompanyHistory } from '../models/CompanyHistory';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiCompaniesUrl = `${environment.apiUrl}api/companies/`;
  private perPage = environment.defaultPaginationSize;

  constructor(private readonly http: HttpClient) {}

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
    // return this.userService.user.pipe(
    //   switchMap((user: AuthenticatedUser) => {
    //     if (user.id) {
    //       const url = this.apiCompaniesUrl + `${companyId}/employee/${user.id}/`;
    //       return this.http.get<CompanyHistory[]>(url);
    //     } else {
    //       return EMPTY;
    //     }
    //   })
    // );
    return of([new CompanyHistory()]);
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

  getCoordsFromAddress(address: string): Observable<any> {
    // TODO: move it to map service
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${localStorage.getItem('apiKey')}`);
  }

  canEdit(company: Company): boolean {
    return true;
    // const urlWithoutParams = company.addedBy ? company.addedBy.split('?')[0] : '0';
    // return this.userService.profileHyperLink.getValue() === urlWithoutParams || this.userService.isStaff.getValue();
  }
}
