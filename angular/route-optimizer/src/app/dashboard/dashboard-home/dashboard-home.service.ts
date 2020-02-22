import { Injectable } from '@angular/core';
import { UserService, AuthenticatedUser } from 'src/app/shared/services/user.service';
import { Requistion } from 'src/app/requistions/requistions.service';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Page } from 'src/app/pagination';
import { environment } from 'src/environments/environment';
import { BusinessTrip } from 'src/app/business-trips/business-trips.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardHomeService {
  employeeApiUrl = `${environment.apiUrl}api/employees/`;

  constructor(private userService: UserService, private http: HttpClient) {}

  getLastRequisitions(requisitionNumber: number): Observable<Requistion[]> {
    return this.userService.user.pipe(
      switchMap((user: AuthenticatedUser) => {
        if (user.id) {
          return this.http
            .get<Page<Requistion>>(`${this.employeeApiUrl}${user.id}/requisitions/?page_size=${requisitionNumber}`)
            .pipe(map((requisitions: Page<Requistion>) => requisitions.results));
        } else {
          return EMPTY;
        }
      })
    );
  }

  getLastBusinessTrips(businessTripNumber: number, type = ''): Observable<BusinessTrip[]> {
    return this.userService.user.pipe(
      switchMap((user: AuthenticatedUser) => {
        if (user.id) {
          return this.http
            .get<Page<BusinessTrip>>(`${this.employeeApiUrl}${user.id}/business-trips/${type}?page_size=${businessTripNumber}`)
            .pipe(map((businessTrips: Page<BusinessTrip>) => businessTrips.results));
        } else {
          return EMPTY;
        }
      })
    );
  }
}
