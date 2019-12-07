import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
  private httpOptions: any;
  public token: string;
  public username: Subject<string> = new Subject();
  public errors: HttpErrorResponse[] = [];
  public userHyperlink: Subject<string> = new Subject();

  constructor(public http: HttpClient, public cookieService: CookieService, private router: Router) {
    this.userHyperlink.subscribe(this.setUsername);
  }

  public login(user: User): void {
    this.http
      .post(`${environment.apiUrl}api-token-auth/`, JSON.stringify(user), {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(map((data: IAuthToken) => data.token))
      .subscribe(
        (data: string) => {
          this.token = data;
          this.cookieService.set('access_token', this.token);
          this.router.navigate(['/dashboard']);
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.errors = err.error;
        }
      );
  }

  setUsername = (userLink): void => {
    console.log(userLink);
    const token = this.cookieService.get('access_token');
    this.http
      .get(userLink, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        })
      })
      .pipe(map((data: User) => data.username))
      .subscribe(user => {
        this.username.next(user);
      });
  };

  public logout() {
    this.token = null;
    localStorage.removeItem('token');
    this.username = null;
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
