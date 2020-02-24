import { Component, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { filter } from 'rxjs/operators';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faUserCircle, faAt, faCalendarAlt, faCar } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  constructor(public userService: UserService) {}

  ngOnInit() {}
}
