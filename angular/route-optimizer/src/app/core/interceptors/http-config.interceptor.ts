import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(private location: Location, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { apiUrl } = environment;
    const token: string = localStorage.getItem('access_token');

    if (token) {
      if (request.url.includes(apiUrl)) {
        if (token) {
          request = request.clone({ headers: request.headers.set('Authorization', `Token ${token}`) });
        }

        if (!request.headers.has('Content-Type')) {
          request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 401) {
          this.router.navigate(['/login']);
        }
        if (error && error.status === 403) {
          this.location.back();

          return EMPTY;
        }
        return throwError(error);
      })
    );
  }
}
