import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService, private router: Router, private location: Location) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { apiUrl } = environment;
    const token: string = this.cookieService.get('access_token');

    if (request.url.includes(apiUrl)) {
      if (token) {
        request = request.clone({ headers: request.headers.set('Authorization', `Token ${token}`) });
      }

      if (!request.headers.has('Content-Type')) {
        request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
      }

      request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 403) {
          this.location.back();

          return EMPTY;
        }
        return throwError(error);
      })
    );
  }
}
