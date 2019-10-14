import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
  public currentUser: any;

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.currentUser = {
      username: ''
    };
    if (this.authService.getIsAuthenticated()) {
      this.loginService.getUsername().subscribe(
        username => {
          this.currentUser = { username };
          this.router.navigate(['dashboard']);
        },
        err => console.log(err)
      );
    } else {
      this.router.navigate(['login']);
    }
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
}
