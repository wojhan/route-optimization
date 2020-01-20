import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class StaffGuard implements CanActivate {
  constructor(private authService: AuthService, private userService: UserService, private router: Router, private location: Location) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return new Observable(subscriber => {
      let isStaff = false;
      if (this.authService.isAuthenticated) {
        isStaff = this.userService.isStaff.getValue();
        if (isStaff) {
          subscriber.next(true);
        } else {
          subscriber.next(false);
          this.location.back();
        }
        subscriber.complete();
      } else {
        this.authService.getIsAuthenticated().subscribe(authStatus => {
          if (authStatus) {
            isStaff = this.userService.isStaff.getValue();
            if (isStaff) {
              subscriber.next(true);
            } else {
              subscriber.next(false);
              this.location.back();
            }
          } else {
            this.router.navigate(['/login']);
            subscriber.next(false);
          }
          subscriber.complete();
        });
      }
    });
  }
}
