import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {
  private apiTokenUrl = `${environment.apiUrl}api-token-auth/`;
  private apiUsersUrl = `${environment.apiUrl}api/users/`;
  private apiChangePasswordUrl = `${environment.apiUrl}api/change-password/`;

  public token: string;
  public user: BehaviorSubject<AuthenticatedUser> = new BehaviorSubject(new AuthenticatedUser());
  public username: BehaviorSubject<string> = new BehaviorSubject('');
  public userHyperlink: Subject<string> = new Subject();
  public profileHyperLink: BehaviorSubject<string> = new BehaviorSubject('');
  public isStaff: BehaviorSubject<boolean> = new BehaviorSubject(false);

  setUsername = (userLink): void => {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.http.get<AuthenticatedUser>(userLink).subscribe((user: AuthenticatedUser) => {
        this.user.next(user);
        this.isStaff.next(user.isStaff);
        this.username.next(user.username);
      });
    }
  };

  constructor(public http: HttpClient) {
    this.userHyperlink.subscribe(this.setUsername);
  }

  public login(user: User): Observable<string> {
    return this.http.post(this.apiTokenUrl, user).pipe(map((data: IAuthToken) => data.token));
  }

  public register(user): Observable<any> {
    return this.http.post(this.apiUsersUrl, user);
  }

  public updateProfile(profile: UpdatedProfile): Observable<AuthenticatedUser> {
    const userId = this.user.getValue().id;
    const url = this.apiUsersUrl + `${userId}/`;
    return this.http.patch<AuthenticatedUser>(url, profile);
  }

  public changePassword(changedPassword: ChangedPassword): Observable<IAuthToken> {
    return this.http.put<IAuthToken>(this.apiChangePasswordUrl, changedPassword);
  }

  public logout() {
    this.token = null;
    localStorage.removeItem('access_token');
    this.profileHyperLink.next('');
    this.userHyperlink.next('');
    this.isStaff.next(false);
    this.user.next(null);
  }
}

export class User {
  username: string;
  password: string;

  toString(): string {
    return this.username + ' ' + this.password;
  }
}

export class AuthenticatedUser {
  url: string;
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isStaff: boolean;
  dateJoined: Date;
}

export interface IAuthToken {
  token?: string;
}

export interface UpdatedProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangedPassword {
  oldPassword: string;
  password: string;
  password2: string;
}
