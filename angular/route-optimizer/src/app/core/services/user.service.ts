import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UpdateProfileFormData } from '../models/forms/UpdateProfileFormData';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';
import { User } from '../models/User';
import { Observable, Subject } from 'rxjs';
import { ChangePasswordFormData } from '../models/forms/ChangePasswordFormData';
import { AuthToken } from '../models/AuthToken';
import { ProfileStats } from '../models/ProfileStats';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUsersUrl = `${environment.apiUrl}api/users/`;
  private apiChangePasswordUrl = `${environment.apiUrl}api/change-password/`;
  private apiProfileStatsUrl = `${environment.apiUrl}api/my-profile/stats/`;

  constructor(private authenticationService: AuthenticationService, private http: HttpClient) {}

  updateProfile(formData: UpdateProfileFormData): Observable<User> {
    const userId = this.authenticationService.currentUser.getValue().id;
    const url = this.apiUsersUrl + `${userId}/`;

    return this.http.patch<User>(url, formData);
  }

  changePassword(formData: ChangePasswordFormData): Observable<boolean | HttpErrorResponse> {
    const result = new Subject<boolean | HttpErrorResponse>();

    this.http.put<AuthToken>(this.apiChangePasswordUrl, formData).subscribe({
      next: () => {
        result.next(true);
      },
      error: err => result.error(err)
    });

    return result.asObservable();
  }

  getProfileStats(): Observable<ProfileStats> {
    return this.http.get<ProfileStats>(this.apiProfileStatsUrl);
  }
}
