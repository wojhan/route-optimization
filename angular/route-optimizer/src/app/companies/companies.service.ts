import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  mockCompanies = [
    new Company(
      'ARSENAL DYSTRYBUCJA PL Sp. z o.o. Sp.komandytowa',
      '9662116338',
      'Przędzalniana 6h',
      '15-688',
      'Bialystok',
      'Podlaskie'
    ),
    new Company('HYDROFAST Sp. z o.o.', '9662054643', 'Przędzalniana 8', '15-688', 'Bialystok', 'Podlaskie'),
    new Company('Prema Sp. z o.o.', '9661391775', 'Wysockiego 150', '15-167', 'Bialystok', 'Podlaskie'),
    new Company('DDD Białystok', '12345678', 'Hetmańska 42', '15-727', 'Bialystok', 'Podlaskie'),
    new Company('Name5', '12345678', 'ulica1 10', '15-502', 'Bialystok', 'Podlaskie'),
    new Company('Name6', '12345678', 'ulica1 10', '15-502', 'Bialystok', 'Podlaskie'),
    new Company('Name7', '12345678', 'ulica1 10', '15-502', 'Bialystok', 'Podlaskie'),
    new Company('Name7', '12345678', 'ulica1 10', '15-502', 'Bialystok', 'Podlaskie'),
    new Company('Name7', '12345678', 'ulica1 10', '15-502', 'Bialystok', 'Podlaskie'),
    new Company('Name7', '12345678', 'ulica1 10', '15-502', 'Bialystok', 'Podlaskie'),
    new Company('Name7', '12345678', 'ulica1 10', '15-502', 'Bialystok', 'Podlaskie'),
    new Company('Name7', '12345678', 'ulica1 10', '15-502', 'Bialystok', 'Podlaskie')
  ];

  constructor() {}

  getAllCompanies(): Observable<Company[]> {
    if (environment.apiEnabled) {
    } else {
      return of(this.mockCompanies);
    }
  }

  addCompany(company: Company): Observable<Company> {
    if (environment.apiEnabled) {
    } else {
      this.mockCompanies.push(company);
      return of(company);
    }
  }
}

export class Company {
  name: string;
  nip: string;
  address: string;
  postcode: string;
  city: string;
  state: string;

  constructor(name: string, nip: string, address: string, postcode: string, city: string, state: string) {
    this.name = name;
    this.nip = nip;
    this.address = address;
    this.postcode = postcode;
    this.city = city;
    this.state = state;
  }
}
