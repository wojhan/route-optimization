import { Injectable } from '@angular/core';
import { AuthenticatedUser, UserService } from 'src/app/shared/services/user.service';
import { Requisition } from 'src/app/requistions/requistions.service';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Page } from 'src/app/pagination';
import { environment } from 'src/environments/environment';
import { BusinessTrip } from 'src/app/business-trips/business-trips.service';
import { BusinessTripState } from '../../my-business-trips/my-business-trips.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardHomeService {
  employeeApiUrl = `${environment.apiUrl}api/employees/`;

  constructor(private userService: UserService, private http: HttpClient) {}

  private buildFilterForBusinessTrips(state: BusinessTripState) {
    switch (state) {
      case BusinessTripState.PAST:
      case BusinessTripState.FUTURE:
      case BusinessTripState.CURRENT:
      default:
        return '';
    }
  }

  getLastRequisitions(requisitionNumber: number): Observable<Requisition[]> {
    return this.userService.user.pipe(
      switchMap((user: AuthenticatedUser) => {
        if (user.id) {
          const url = this.employeeApiUrl + `${user.id}/requisitions/?page_size=${requisitionNumber}`;
          return this.http.get<Page<Requisition>>(url).pipe(map((requisitions: Page<Requisition>) => requisitions.results));
        } else {
          return EMPTY;
        }
      })
    );
  }

  getLastBusinessTrips(businessTripNumber: number, type: BusinessTripState = null): Observable<BusinessTrip[]> {
    return this.userService.user.pipe(
      switchMap((user: AuthenticatedUser) => {
        if (user.id) {
          const filter = this.buildFilterForBusinessTrips(type);
          const url = this.employeeApiUrl + `${user.id}/business-trips/?page_size=${businessTripNumber}` + filter;
          return this.http.get<Page<BusinessTrip>>(url).pipe(map((businessTrips: Page<BusinessTrip>) => businessTrips.results));
        } else {
          return EMPTY;
        }
      })
    );
  }
}
