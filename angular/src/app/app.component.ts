import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from './shared/services/user.service';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
  public currentUser: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = {
      username: ''
    };
    if (this.authService.getIsAuthenticated()) {
      this.userService.getUsername().subscribe(
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
