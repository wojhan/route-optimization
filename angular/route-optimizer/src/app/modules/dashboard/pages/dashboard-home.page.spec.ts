import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHomePage } from './dashboard-home.page';

describe('DashboardHomeComponent', () => {
  let component: DashboardHomePage;
  let fixture: ComponentFixture<DashboardHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardHomePage]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
