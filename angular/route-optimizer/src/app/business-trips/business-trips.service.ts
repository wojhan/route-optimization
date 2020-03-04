import { Injectable } from '@angular/core';
import { Employee } from '../employees/employees.service';
import { Company } from '../companies/companies.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page, queryPaginated } from '../pagination';
import { Requisition } from '../requistions/requistions.service';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessTripsService {
  private apiBusinessTripsUrl = `${environment.apiUrl}api/business-trips/`;
  private apiEmployeesUrl = `${environment.apiUrl}api/employees/`;
  private perPage = environment.defaultPaginationSize;

  constructor(private http: HttpClient) {}

  list(employeeId?: number, urlOrFilter?: string | object): Observable<Page<BusinessTrip>> {
    let apiUrl = this.apiBusinessTripsUrl;
    if (employeeId) {
      apiUrl = this.apiEmployeesUrl + `${employeeId}/business-trips/`;
    }
    return queryPaginated<BusinessTrip>(this.http, new HttpHeaders(), apiUrl, this.perPage, urlOrFilter);
  }

  getBusinessTrip(id: number): Observable<BusinessTrip> {
    const url = this.apiBusinessTripsUrl + `${id}/`;
    return this.http.get<BusinessTrip>(url).pipe(
      map((businessTrip: any) => {
        businessTrip.assignee = businessTrip.assignee.user;
        return businessTrip;
      })
    );
  }

  addBusinessTrip(businessTrip: BusinessTrip): Observable<BusinessTrip> {
    return this.http.post<BusinessTrip>(this.apiBusinessTripsUrl, businessTrip);
  }

  partialUpdateBusinessTrip(businessTripId: number, data: object): Observable<BusinessTrip> {
    const url = this.apiBusinessTripsUrl + `${businessTripId}/`;
    return this.http.patch<BusinessTrip>(url, data);
  }

  deleteBusinessTrip(businessTripId: number): Observable<any> {
    const url = this.apiBusinessTripsUrl + `${businessTripId}/`;
    return this.http.delete(url);
  }
}

export class Route {
  startPoint: Company;
  endPoint: Company;
  segmentOrder: number;
  day: number;
  distance: number;
}

export class BusinessTrip {
  id: number;
  startDate: string;
  startDateAsDate: Date;
  finishDate: string;
  finishDateAsDate: Date;
  duration: number;
  distance: number;
  assignee: Employee;
  estimatedProfit: number;
  routes: Route[];
  requistions: Requisition[];
  maxDistance: number;
  isProcessed: boolean;
}
