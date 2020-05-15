import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInactiveUsersComponent } from './dashboard-inactive-users.component';

describe('InactiveUsersComponent', () => {
  let component: DashboardInactiveUsersComponent;
  let fixture: ComponentFixture<DashboardInactiveUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardInactiveUsersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardInactiveUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
