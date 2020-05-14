import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBusinessTripStatsComponent } from './dashboard-business-trip-stats.component';

describe('BusinessTripStatsComponent', () => {
  let component: DashboardBusinessTripStatsComponent;
  let fixture: ComponentFixture<DashboardBusinessTripStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardBusinessTripStatsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardBusinessTripStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
