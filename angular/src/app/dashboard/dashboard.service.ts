import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private isSidebarHidden: boolean;

  mockCompanies = [
    new Company(
      'ARSENAL DYSTRYBUCJA PL Sp. z o.o. Sp.komandytowa',
      '9662116338',
      'Przędzalniana',
      '6h',
      '15-688',
      'Bialystok'
    ),
    new Company('HYDROFAST Sp. z o.o.', '9662054643', 'Przędzalniana', '8', '15-688', 'Bialystok'),
    new Company('Prema Sp. z o.o.', '9661391775', 'Wysockiego', '150', '15-167', 'Bialystok'),
    new Company('DDD Białystok', '12345678', 'Hetmańska', '42', '15-727', 'Bialystok'),
    new Company('Name5', '12345678', 'ulica1', '10', '15-502', 'Bialystok'),
    new Company('Name6', '12345678', 'ulica1', '10', '15-502', 'Bialystok'),
    new Company('Name7', '12345678', 'ulica1', '10', '15-502', 'Bialystok'),
    new Company('Name7', '12345678', 'ulica1', '10', '15-502', 'Bialystok'),
    new Company('Name7', '12345678', 'ulica1', '10', '15-502', 'Bialystok'),
    new Company('Name7', '12345678', 'ulica1', '10', '15-502', 'Bialystok'),
    new Company('Name7', '12345678', 'ulica1', '10', '15-502', 'Bialystok'),
    new Company('Name7', '12345678', 'ulica1', '10', '15-502', 'Bialystok')
  ];

  constructor() {
    this.isSidebarHidden = localStorage.getItem('isSidebarHidden') === 'false' ? false : true;
    if (!this.isSidebarHidden) {
      this.isSidebarHidden = false;
    }
    console.log(this.isSidebarHidden);
  }

  getAllCompanies(): Observable<Company[]> {
    if (environment.apiEnabled) {
    } else {
      return of(this.mockCompanies);
    }
  }

  setIsSidebarHidden(value: boolean): void {
    this.isSidebarHidden = value;
  }

  getIsSidebarHidden(): boolean {
    return this.isSidebarHidden;
  }
}

export class Company {
  name: string;
  nip: string;
  street: string;
  no: string;
  postcode: string;
  city: string;

  constructor(name: string, nip: string, street: string, no: string, postcode: string, city: string) {
    this.name = name;
    this.nip = nip;
    this.street = street;
    this.no = no;
    this.postcode = postcode;
    this.city = city;
  }
}
