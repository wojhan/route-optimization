import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripDetailRouteInfoComponent } from './business-trip-detail-route-info.component';

describe('BusinessTripDetailRouteInfoComponent', () => {
  let component: BusinessTripDetailRouteInfoComponent;
  let fixture: ComponentFixture<BusinessTripDetailRouteInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTripDetailRouteInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTripDetailRouteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
