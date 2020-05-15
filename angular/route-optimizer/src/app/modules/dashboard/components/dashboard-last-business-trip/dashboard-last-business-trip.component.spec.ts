import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLastBusinessTripComponent } from './dashboard-last-business-trip.component';

describe('LastBusinessTripComponent', () => {
  let component: DashboardLastBusinessTripComponent;
  let fixture: ComponentFixture<DashboardLastBusinessTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardLastBusinessTripComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLastBusinessTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
