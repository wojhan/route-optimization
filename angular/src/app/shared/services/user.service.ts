import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {
  // http options used for making API calls
  private httpOptions: any;

  // the actual JWT token
  public token: string;

  // the username of the logged in user
  public username: string;

  // error messages received from the login attempt
  public errors: HttpErrorResponse[] = [];

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin:': '*'
      }),
      responsesType: 'text'
    };
  }

  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user: User): void {
    if (!environment.apiEnabled) {
      this.token = user.username === 'admin' ? environment.adminToken : environment.userToken;
      localStorage.setItem('token', this.token);
      return;
    }
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
          localStorage.setItem('token', this.token);
        },
        (err: HttpErrorResponse) => {
          this.errors = err.error;
        }
      );
  }

  public getUsername(): Observable<string> {
    if (!environment.apiEnabled) {
      if (this.token === environment.adminToken) {
        return of('admin');
      } else if (this.token === environment.userToken) {
        return of('user');
      }
    }
    return this.http
      .get(`${environment.apiUrl}api/users/current`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Token ${this.token}`,
          'Access-Control-Allow-Origin:': '*'
        })
      })
      .pipe(map((data: User) => data.username));
  }

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
