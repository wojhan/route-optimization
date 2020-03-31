import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { queryPaginated } from '../helpers/pagination';
import { Page } from '../models/Page';
import { BusinessTrip } from '../models/BusinessTrip';
import { DateTimeConverter } from '../helpers/DateTimeConverter';

@Injectable({
  providedIn: 'root'
})
export class BusinessTripService {
  private apiBusinessTripsUrl = `${environment.apiUrl}api/business-trips/`;
  private apiEmployeesUrl = `${environment.apiUrl}api/employees/`;
  private perPage = environment.defaultPaginationSize;

  constructor(private http: HttpClient) {}

  list(employeeId?: number, urlOrFilter?: string | object, pageSize?: number): Observable<Page<BusinessTrip>> {
    let apiUrl = this.apiBusinessTripsUrl;
    if (employeeId) {
      apiUrl = this.apiEmployeesUrl + `${employeeId}/business-trips/`;
    }
    return queryPaginated<BusinessTrip>(this.http, apiUrl, pageSize ? pageSize : this.perPage, urlOrFilter);
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
}
