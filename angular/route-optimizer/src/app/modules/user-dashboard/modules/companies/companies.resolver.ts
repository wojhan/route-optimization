import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Company } from '@route-optimizer/core/models/Company';
import { CompanyService } from '@route-optimizer/core/services/company.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class CompaniesResolve implements Resolve<Company> {
  constructor(private companyService: CompanyService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Company> {
    if (route.params && route.params.id) {
      return this.companyService.getCompany(+route.params.id);
    } else {
      return of(null);
    }
  }
}
