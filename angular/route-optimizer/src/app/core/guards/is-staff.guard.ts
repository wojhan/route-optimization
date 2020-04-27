import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { filter, map } from 'rxjs/operators';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class IsStaffGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('access_token');

    if (token) {
      const currentUser = this.authenticationService.currentUser.getValue();
      if (currentUser === undefined) {
        return this.authenticationService.currentUser.pipe(
          filter((user: User) => user !== undefined),
          map((user: User) => {
            return user.isStaff;
          })
        );
      }

      if (currentUser === null) {
        return false;
      }

      return currentUser.isStaff;
    }

    return false;
  }
}
