import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripFormComponent } from './business-trip-form.component';

describe('BusinessTripFormComponent', () => {
  let component: BusinessTripFormComponent;
  let fixture: ComponentFixture<BusinessTripFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTripFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTripFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
