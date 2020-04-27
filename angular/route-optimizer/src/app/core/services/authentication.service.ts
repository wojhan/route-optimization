import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthToken } from '../models/AuthToken';
import { map, switchMap, tap } from 'rxjs/operators';
import { RegisteringUser } from '../models/RegisteringUser';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private apiTokenUrl = `${environment.apiUrl}api-token-auth/`;
  private apiObtainUserUrl = `${environment.apiUrl}api/token`;
  private apiUsersUrl = `${environment.apiUrl}api/users/`;

  public currentUser: BehaviorSubject<User>;

  constructor(private readonly http: HttpClient) {
    this.currentUser = new BehaviorSubject<User>(undefined);
    const token = localStorage.getItem('access_token');
    if (token) {
      this.getUserInfo({ token }).subscribe({
        next: (user: User) => {
          this.currentUser.next(user);
        },
        error: () => {
          localStorage.removeItem('access_token');
        }
      });
    } else {
      this.currentUser.next(null);
    }
  }

  public getUserInfo(token: AuthToken): Observable<User> {
    return this.http.post(this.apiObtainUserUrl, token).pipe(
      map((tokenInfo: TokenInfo) => tokenInfo.user),
      switchMap((userUrl: string) => this.http.get<User>(userUrl))
    );
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<AuthToken>(this.apiTokenUrl, { username, password })
      .pipe(
        tap((token: AuthToken) => localStorage.setItem('access_token', token.token)),
        switchMap((token: AuthToken) => {
          return this.getUserInfo(token).pipe(tap((user: User) => this.currentUser.next(user)));
        })
      );
  }

  register(user: RegisteringUser): Observable<User> {
    return this.http.post<User>(this.apiUsersUrl, user);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.currentUser.next(null);
    location.reload();
  }
}

interface TokenInfo {
  key: string;
  user: string;
  profile: string;
  isStaff: boolean;
}
