import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BusinessTrip } from '../business-trips/business-trips.service';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticatedUser, UserService } from '../shared/services/user.service';
import { map, switchMap } from 'rxjs/operators';
import { Page } from '../pagination';

@Injectable({
  providedIn: 'root'
})
export class MyBusinessTripsService {
  private employeesApiUrl = `${environment.apiUrl}api/employees/`;
  private perPage = environment.numberOfBusinessTripsInCategory;

  constructor(private http: HttpClient, private userService: UserService) {}

  private buildFilterForBusinessTrips(state: BusinessTripState) {
    switch (state) {
      case BusinessTripState.PAST:
      case BusinessTripState.FUTURE:
      case BusinessTripState.CURRENT:
      default:
        return '';
    }
  }

  getCurrentBusinessTrips(state: BusinessTripState): Observable<BusinessTrip[]> {
    return this.userService.user.pipe(
      switchMap((user: AuthenticatedUser) => {
        if (user.id) {
          const filter = this.buildFilterForBusinessTrips(state);
          const url = this.employeesApiUrl + `${user.id}/business-trips/?per_page=${this.perPage}` + filter;
          return this.http.get<Page<BusinessTrip>>(url);
        } else {
          return EMPTY;
        }
      }),
      map((employees: Page<BusinessTrip>) => employees.results)
    );
  }
}

export enum BusinessTripState {
  PAST = 'past',
  CURRENT = 'current',
  FUTURE = 'future'
}
