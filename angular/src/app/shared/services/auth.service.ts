import { Injectable } from '@angular/core';
import { LoginService } from '../../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated: boolean;

  constructor(private loginService: LoginService) {
    this.isAuthenticated = this.getIsAuthenticated();
  }

  public getIsAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    this.loginService.token = token;

    return token != null && token.length > 0;
  }
}
