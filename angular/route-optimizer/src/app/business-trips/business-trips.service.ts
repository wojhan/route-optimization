import { Injectable } from '@angular/core';
import { Employee } from '../employees/employees.service';
import { Company } from '../companies/companies.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../shared/services/user.service';
import { queryPaginated, Page } from '../pagination';
import { WebSocketService } from '../shared/services/websocket.service';
import { Requistion } from '../requistions/requistions.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BusinessTripsService {
  apiUrl = 'http://localhost:8000/api/business-trips/';
  perPage = 40;
  defaultHeaders = new HttpHeaders();

  constructor(private http: HttpClient, private userService: UserService, private wsService: WebSocketService) {}

  list(employeeId?: number, urlOrFilter?: string | object): Observable<Page<BusinessTrip>> {
    let apiUrl = this.apiUrl;
    if (employeeId) {
      apiUrl = `http://localhost:8000/api/employees/${employeeId}/business-trips/`;
    }
    return queryPaginated<BusinessTrip>(this.http, this.defaultHeaders, apiUrl, this.perPage, urlOrFilter);
  }

  getBusinessTrip(id: number): Observable<BusinessTrip> {
    return this.http.get<BusinessTrip>(`${this.apiUrl}${id}/`).pipe(
      map((businessTrip: any) => {
        businessTrip.assignee = businessTrip.assignee.user;
        return businessTrip;
      })
    );
  }

  addBusinessTrip(businessTrip: BusinessTrip): Observable<BusinessTrip> {
    return this.http.post<BusinessTrip>(`${this.apiUrl}`, businessTrip);
  }

  partialUpdateBusinessTrip(businessTripId: number, data: object): Observable<BusinessTrip> {
    return this.http.patch<BusinessTrip>(`${this.apiUrl}${businessTripId}/`, data);
  }

  deleteBusinessTrip(businessTripId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${businessTripId}/`);
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
  finishDate: string;
  duration: number;
  distance: number;
  assignee: Employee;
  estimatedProfit: number;
  routes: Route[];
  requistions: Requistion[];
  maxDistance: number;
}
