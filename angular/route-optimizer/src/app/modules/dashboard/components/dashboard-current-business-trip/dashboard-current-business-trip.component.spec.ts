import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCurrentBusinessTripComponent } from './dashboard-current-business-trip.component';

describe('CurrentBusinessTripComponent', () => {
  let component: DashboardCurrentBusinessTripComponent;
  let fixture: ComponentFixture<DashboardCurrentBusinessTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardCurrentBusinessTripComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCurrentBusinessTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
