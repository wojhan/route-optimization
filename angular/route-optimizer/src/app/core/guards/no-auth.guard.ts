import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('access_token');

    const result = new Subject<boolean>();

    if (token) {
      this.authenticationService.getUserInfo({ token }).subscribe({
        next: () => {
          console.log('next');
          result.next(false);
          result.complete();
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          console.log('error');
          localStorage.removeItem('access_token');
          result.next(true);
          result.complete();
        }
      });

      return result;
    }
    console.log('no token');
    return true;
  }
}
