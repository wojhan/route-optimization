import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { map, delay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  private httpOptions: any;
  public token: string;
  public username: BehaviorSubject<string> = new BehaviorSubject('');
  public errors: any[] = [];
  public userHyperlink: Subject<string> = new Subject();
  public profileHyperLink: BehaviorSubject<string> = new BehaviorSubject('');
  public isStaff: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(public http: HttpClient, public cookieService: CookieService, private router: Router) {
    this.userHyperlink.subscribe(this.setUsername);
  }

  public login(user: User): Observable<string> {
    return this.http
      .post(`${environment.apiUrl}api-token-auth/`, JSON.stringify(user), {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(
        tap(() => {
          this.errors = [];
        }),
        map((data: IAuthToken) => data.token)
      );
  }

  public register(user): Observable<any> {
    return this.http.post(`${environment.apiUrl}api/users/`, user);
  }

  setUsername = (userLink): void => {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.http
        .get(userLink, {
          responseType: 'json',
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`
          })
        })
        .pipe(map((data: any) => ({ username: data.username, staff: data.isStaff })))
        .subscribe(user => {
          this.isStaff.next(user.staff);
          this.username.next(user.username);
        });
    }
  };

  public logout() {
    this.token = null;
    localStorage.removeItem('access_token');
    this.profileHyperLink.next('');
  }
}

export class User {
  username: string;
  password: string;

  constructor() {
    this.username = '';
    this.password = '';
  }

  toString(): string {
    return this.username + ' ' + this.password;
  }
}

export interface IAuthToken {
  token?: string;
}
