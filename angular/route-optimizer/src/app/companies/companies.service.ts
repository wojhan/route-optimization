import { Injectable } from '@angular/core';
import { concat, defer, EMPTY, from, Observable } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page, queryPaginated } from '../pagination';
import { AuthenticatedUser, UserService } from '../shared/services/user.service';
import { BusinessTrip } from '../business-trips/business-trips.service';
import { Requisition } from '../requistions/requistions.service';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private apiCompaniesUrl = `${environment.apiUrl}api/companies/`;
  private perPage = environment.defaultPaginationSize;

  constructor(private readonly http: HttpClient, private userService: UserService) {}

  list(urlOrFilter?: string | object): Observable<Page<Company>> {
    return queryPaginated<Company>(this.http, new HttpHeaders(), this.apiCompaniesUrl, this.perPage, urlOrFilter);
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
    return this.userService.user.pipe(
      switchMap((user: AuthenticatedUser) => {
        if (user.id) {
          const url = this.apiCompaniesUrl + `${companyId}/employee/${user.id}/`;
          return this.http.get<CompanyHistory[]>(url);
        } else {
          return EMPTY;
        }
      })
    );
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
  requisition: Requisition;
}
