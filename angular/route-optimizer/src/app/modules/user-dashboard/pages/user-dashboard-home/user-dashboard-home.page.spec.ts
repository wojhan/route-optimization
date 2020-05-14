import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardHomePage } from './user-dashboard-home.page';

describe('UserDashboardHomeComponent', () => {
  let component: UserDashboardHomePage;
  let fixture: ComponentFixture<UserDashboardHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserDashboardHomePage]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDashboardHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
