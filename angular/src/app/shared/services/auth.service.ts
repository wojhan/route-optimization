import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated: boolean;

  constructor(private userService: UserService) {
    this.isAuthenticated = this.getIsAuthenticated();
  }

  public getIsAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    this.userService.token = token;

    return token != null && token.length > 0;
  }
}
