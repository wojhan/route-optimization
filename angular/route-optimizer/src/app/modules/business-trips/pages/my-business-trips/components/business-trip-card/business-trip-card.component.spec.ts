import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripCardComponent } from './business-trip-card.component';

describe('BusinessTripCardComponent', () => {
  let component: BusinessTripCardComponent;
  let fixture: ComponentFixture<BusinessTripCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTripCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTripCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
