import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiTokenUrl = `${environment.apiUrl}api/token`;

  constructor(private userService: UserService, public http: HttpClient) {}

  public isAuthenticated = false;

  public getIsAuthenticated(): Observable<boolean> {
    const token: string = localStorage.getItem('access_token');
    return new Observable(subscriber => {
      if (!token) {
        subscriber.next(false);
      } else {
        this.http
          .post<UserToken>(this.apiTokenUrl, { token })
          .subscribe(
            (data: UserToken) => {
              this.userService.userHyperlink.next(data.user);
              this.userService.profileHyperLink.next(data.profile);
              this.userService.token = data.key;
              this.isAuthenticated = true;
              subscriber.next(true);
            },
            () => {
              subscriber.next(false);
            }
          );
      }
    });
  }
}

export interface UserToken {
  user?: string;
  profile?: string;
  key?: string;
}
