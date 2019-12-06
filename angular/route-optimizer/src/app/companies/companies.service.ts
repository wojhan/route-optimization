import { Injectable } from "@angular/core";
import { of, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Page, queryPaginated } from "../pagination";
import { UserService } from "../shared/services/user.service";

@Injectable({
  providedIn: "root"
})
export class CompaniesService {
  apiUrl = "http://localhost:8000/api/companies/";
  perPage = 40;

  constructor(
    private readonly http: HttpClient,
    private userService: UserService
  ) {}

  list(urlOrFilter?: string | object): Observable<Page<Company>> {
    return queryPaginated<Company>(
      this.http,
      this.apiUrl,
      this.perPage,
      urlOrFilter
    );
  }

  getCompany(companyId: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}${companyId}/`, {
      headers: new HttpHeaders({
        Authorization: `Token ${this.userService.token}`
      })
    });
  }

  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}`, company, {
      headers: new HttpHeaders({
        Authorization: `Token ${this.userService.token}`
      })
    });
  }

  editCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}${company.id}/`, company, {
      headers: new HttpHeaders({
        Authorization: `Token ${this.userService.token}`
      })
    });
  }

  deleteCompany(company: Company): Observable<any> {
    return this.http.delete(`${this.apiUrl}${company.id}/`, {
      headers: new HttpHeaders({
        Authorization: `Token ${this.userService.token}`
      })
    });
  }

  getCoordsFromAddress(address: string): Observable<any> {
    return this.http.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${localStorage.getItem(
        "apiKey"
      )}`
    );
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

interface ApiMessage {}
