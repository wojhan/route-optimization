import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return new Observable(subscriber => {
      this.auth.getIsAuthenticated().subscribe(authStatus => {
        if (authStatus) {
          subscriber.next(true);
        } else {
          this.router.navigate(["/login"]);
          subscriber.next(false);
        }
        subscriber.complete();
      });
    });
  }
}
