import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthenticatedUser, UserService } from '../services/user.service';
import { filter, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StaffGuard implements CanActivate {
  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const isAuthenticated = of(this.authService.isAuthenticated);
    const user = this.userService.user.pipe(filter((u: AuthenticatedUser) => u.id > 0));

    return isAuthenticated.pipe(
      switchMap(authValue => {
        if (authValue) {
          return user.pipe(map((u: AuthenticatedUser) => u.isStaff));
        } else {
          return of(false);
        }
      }),
      tap(v => {
        if (!v) {
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }
}
