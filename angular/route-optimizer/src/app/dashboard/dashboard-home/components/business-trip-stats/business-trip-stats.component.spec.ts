import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripStatsComponent } from './business-trip-stats.component';

describe('BusinessTripStatsComponent', () => {
  let component: BusinessTripStatsComponent;
  let fixture: ComponentFixture<BusinessTripStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTripStatsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTripStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
