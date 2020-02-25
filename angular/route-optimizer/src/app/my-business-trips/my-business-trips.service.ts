import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BusinessTrip } from '../business-trips/business-trips.service';
import { Observable, EMPTY } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService, AuthenticatedUser } from '../shared/services/user.service';
import { switchMap, map } from 'rxjs/operators';
import { Employee } from '../employees/employees.service';
import { Page } from '../pagination';

@Injectable({
  providedIn: 'root'
})
export class MyBusinessTripsService {
  apiUrl = `${environment.apiUrl}api/employees/`;

  constructor(private http: HttpClient, private userService: UserService) {}

  getCurrentBusinessTrips(state: BusinessTripState): Observable<BusinessTrip[]> {
    return this.userService.user.pipe(
      switchMap((user: AuthenticatedUser) => {
        if (user.id) {
          return this.http.get<Page<BusinessTrip>>(`${this.apiUrl}${user.id}/business-trips/${state}/?per_page=6`);
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
