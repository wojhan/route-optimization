import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { BusinessTrip } from '../../../../core/models/BusinessTrip';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { Page } from '../../../../core/models/Page';

@Injectable({
  providedIn: 'root'
})
export class MyBusinessTripsService {
  private employeesApiUrl = `${environment.apiUrl}api/employees/`;
  private perPage = environment.numberOfBusinessTripsInCategory;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {}

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
    // return this.userService.user.pipe(
    //   switchMap((user: AuthenticatedUser) => {
    //     if (user.id) {
    //       const filter = this.buildFilterForBusinessTrips(state);
    //       const url = this.employeesApiUrl + `${user.id}/business-trips/?per_page=${this.perPage}` + filter;
    //       return this.http.get<Page<BusinessTrip>>(url);
    //     } else {
    //       return EMPTY;
    //     }
    //   }),
    //   map((employees: Page<BusinessTrip>) => employees.results)
    // );
    const filter = this.buildFilterForBusinessTrips(state);
    const userId = this.authenticationService.currentUser.getValue().id;
    const url = this.employeesApiUrl + `${userId}/business-trips/?page_size=${this.perPage}` + filter;

    return this.http.get<Page<BusinessTrip>>(url).pipe(map((page: Page<BusinessTrip>) => page.results));
  }
}

export enum BusinessTripState {
  PAST = 'past',
  CURRENT = 'current',
  FUTURE = 'future'
}
