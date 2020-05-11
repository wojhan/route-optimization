import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { environment } from '@route-optimizer/environment/environment';
import { queryPaginated } from '../helpers/pagination';
import { Page } from '../models/Page';
import { BusinessTrip } from '../models/BusinessTrip';
import { DateTimeConverter } from '../helpers/DateTimeConverter';
import { RouteType } from '../enums/RouteType';

@Injectable({
  providedIn: 'root'
})
export class BusinessTripService {
  private apiBusinessTripsUrl = `${environment.apiUrl}api/business-trips/`;
  private apiEmployeesUrl = `${environment.apiUrl}api/employees/`;
  private wsBusinessTripUrl = `${environment.wsBusinessTripUrl}ws/business_trip/`;
  private perPage = environment.defaultPaginationSize;

  constructor(private http: HttpClient) {}

  list(employeeId?: number, urlOrFilter?: string | object, pageSize?: number): Observable<Page<BusinessTrip>> {
    let apiUrl = this.apiBusinessTripsUrl;
    if (employeeId) {
      apiUrl = this.apiEmployeesUrl + `${employeeId}/business-trips/`;
    }
    return queryPaginated<BusinessTrip>(this.http, apiUrl, pageSize ? pageSize : this.perPage, urlOrFilter);
  }

  getBusinessTrip(businessTripId: number): Observable<BusinessTrip> {
    return this.http.get<BusinessTrip>(this.apiBusinessTripsUrl + `${businessTripId}/`);
  }

  getBusinessTripWS(businessTripId: number): WebSocketSubject<any> {
    return webSocket(this.wsBusinessTripUrl + `${businessTripId}/`);
  }

  getPastBusinessTrips(businessTripsPageSize: number, userId?: number) {
    const now = new DateTimeConverter('yyyy-mm-dd+hh:ii:ss');
    const filter = {
      finish_date__lt: now.formattedDate
    };
    return this.list(userId, filter, businessTripsPageSize);
  }

  getCurrentBusinessTrips(businessTripsPageSize: number, userId?: number) {
    const now = new DateTimeConverter('yyyy-mm-dd+hh:ii:ss');
    const filter = {
      start_date__lt: now.formattedDate,
      finish_date__gt: now.formattedDate
    };
    return this.list(userId, filter, businessTripsPageSize);
  }
  getFutureBusinessTrips() {}

  getCompanyNumberInBusinessTrip(businessTrip: BusinessTrip): number[] {
    const numbers = [];

    for (let i = 0; i < businessTrip.duration; i++) {
      let current = 0;
      const routes = businessTrip.routes.filter(v => v.day === i);
      routes.forEach((route, index) => {
        if (index === routes.length - 1 || route.routeType === RouteType.VISIT) {
          current++;
        }
      });

      numbers.push(current);
    }

    return numbers;
  }
}
