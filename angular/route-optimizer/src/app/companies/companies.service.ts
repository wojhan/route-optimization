import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page, queryPaginated } from '../pagination';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  apiUrl = 'http://localhost:8000/api/companies/';
  perPage = 40;

  constructor(private readonly http: HttpClient) {}

  list(urlOrFilter?: string | object): Observable<Page<Company>> {
    return queryPaginated<Company>(this.http, this.apiUrl, this.perPage, urlOrFilter);
  }

  addCompany(company: Company): Observable<Company> {
    return new Observable(s => s.next(company));
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
}
