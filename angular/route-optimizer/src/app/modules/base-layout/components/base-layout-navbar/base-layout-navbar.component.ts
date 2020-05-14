import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '@route-optimizer/core/models/User';
import { IconDefinition, faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-base-layout-navbar',
  templateUrl: './base-layout-navbar.component.html'
})
export class BaseLayoutNavbarComponent implements OnInit {
  @Input() currentUser: User;

  @Output() toggledSidebar: EventEmitter<any> = new EventEmitter();

  faBars: IconDefinition = faBars;
  constructor() {}

  ngOnInit() {}

  toggleSidebar() {
    this.toggledSidebar.emit();
  }

  logout() {}
}
