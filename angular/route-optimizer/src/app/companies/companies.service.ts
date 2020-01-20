import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page, queryPaginated } from '../pagination';
import { UserService } from '../shared/services/user.service';

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
