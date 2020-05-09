import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripDetailBusinessTripInfoComponent } from './business-trip-detail-business-trip-info.component';

describe('BusinessTripDetailBusinessTripInfoComponent', () => {
  let component: BusinessTripDetailBusinessTripInfoComponent;
  let fixture: ComponentFixture<BusinessTripDetailBusinessTripInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTripDetailBusinessTripInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTripDetailBusinessTripInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
