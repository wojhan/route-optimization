import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripDetailFailureComponent } from './business-trip-detail-failure.component';

describe('BusinessTripDetailFailureComponent', () => {
  let component: BusinessTripDetailFailureComponent;
  let fixture: ComponentFixture<BusinessTripDetailFailureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTripDetailFailureComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTripDetailFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
