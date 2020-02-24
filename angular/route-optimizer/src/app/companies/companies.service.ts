import { Injectable } from '@angular/core';
import { of, Observable, defer, from, concat, EMPTY } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page, queryPaginated } from '../pagination';
import { UserService, AuthenticatedUser } from '../shared/services/user.service';
import { BusinessTrip } from '../business-trips/business-trips.service';
import { Requistion } from '../requistions/requistions.service';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  apiUrl = 'http://localhost:8000/api/companies/';
  perPage = 40;
  defaultHeaders = new HttpHeaders();

  constructor(private readonly http: HttpClient, private userService: UserService) {}

  list(urlOrFilter?: string | object): Observable<Page<Company>> {
    return queryPaginated<Company>(this.http, this.defaultHeaders, this.apiUrl, this.perPage, urlOrFilter);
  }

  getCompany(companyId: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}${companyId}/`);
  }

  getCompanies(urlOrFilter: string | any): Observable<Company> {
    if (!urlOrFilter || !urlOrFilter.search) {
      return EMPTY;
    }

    let page = urlOrFilter;

    if (urlOrFilter instanceof Object) {
      page = `${this.apiUrl}?search=${urlOrFilter.search}&format=json`;
    }

    // const page = urlOrFilter ?  :`${this.apiUrl}?search=${search}&format=json`;

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
    return this.userService.user.pipe(
      switchMap((user: AuthenticatedUser) => {
        if (user.id) {
          return this.http.get<CompanyHistory[]>(`${this.apiUrl}${companyId}/employee/${user.id}/`);
        } else {
          return EMPTY;
        }
      })
    );
  }

  // getCompanies(page?): Observable<any> {
  //   return defer(() => {
  //     const page$ = page ? page : `${this.apiUrl}?format=json&page=1&page_size=${this.perPage}`;
  //     return this.list(page$).pipe(
  //       mergeMap(({ results, next }) => {
  //         const results$ = from(results);
  //         const next$ = next ? this.getCompanies(next) : EMPTY;
  //         return concat(results$, next$);
  //       })
  //     );
  //   });
  // }

  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}`, company);
  }

  editCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}${company.id}/`, company);
  }

  deleteCompany(companyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${companyId}/`);
  }

  getCoordsFromAddress(address: string): Observable<any> {
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${localStorage.getItem('apiKey')}`);
  }

  canEdit(company: Company): boolean {
    const urlWithoutParams = company.addedBy ? company.addedBy.split('?')[0] : '0';
    return this.userService.profileHyperLink.getValue() === urlWithoutParams || this.userService.isStaff.getValue();
  }
}
export class Company {
  id: number;
  name: string;
  nameShort: string;
  nip: string;
  street: string;
  houseNo: string;
  postcode: string;
  city: string;
  latitude: number;
  longitude: number;
  addedBy: string;
}

export class CompanyHistory {
  endPoint: Company;
  day: number;
  businessTrip: BusinessTrip;
  requisition: Requistion;
}
