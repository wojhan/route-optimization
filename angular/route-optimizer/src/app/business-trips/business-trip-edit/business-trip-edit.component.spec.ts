import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripEditComponent } from './business-trip-edit.component';

describe('BusinessTripEditComponent', () => {
  let component: BusinessTripEditComponent;
  let fixture: ComponentFixture<BusinessTripEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTripEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTripEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
