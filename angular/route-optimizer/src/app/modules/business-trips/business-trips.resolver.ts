import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { BusinessTrip } from '@route-optimizer/core/models/BusinessTrip';
import { BusinessTripService } from '@route-optimizer/core/services/business-trip.service';

@Injectable()
export class BusinessTripsResolver implements Resolve<BusinessTrip> {
  constructor(private businessTripService: BusinessTripService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BusinessTrip> {
    return this.businessTripService.getBusinessTrip(+route.paramMap.get('id'));
  }
}
