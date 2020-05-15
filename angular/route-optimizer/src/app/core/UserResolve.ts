import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { User } from '@route-optimizer/core/models/User';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@route-optimizer/core/services/authentication.service';
import { filter, take, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class UserResolve implements Resolve<User> {
  constructor(private authenticationService: AuthenticationService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this.authenticationService.currentUser.asObservable().pipe(
      filter(u => !!u),
      take(1)
    );
  }
}
