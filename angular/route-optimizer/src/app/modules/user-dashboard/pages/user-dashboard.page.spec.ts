import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardPage } from './user-dashboard.page';

describe('UserDashboardComponent', () => {
  let component: UserDashboardPage;
  let fixture: ComponentFixture<UserDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserDashboardPage]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
