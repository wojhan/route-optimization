import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripDetailComponent } from './business-trip-detail.component';

describe('BusinessTripDetailComponent', () => {
  let component: BusinessTripDetailComponent;
  let fixture: ComponentFixture<BusinessTripDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTripDetailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTripDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
