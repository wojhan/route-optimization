import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCompanyListComponent } from './dashboard-company-list.component';

describe('DashboardCompanyListComponent', () => {
  let component: DashboardCompanyListComponent;
  let fixture: ComponentFixture<DashboardCompanyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardCompanyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
