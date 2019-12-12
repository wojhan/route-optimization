import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripAddComponent } from './business-trip-add.component';

describe('BusinessTripAddComponent', () => {
  let component: BusinessTripAddComponent;
  let fixture: ComponentFixture<BusinessTripAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTripAddComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTripAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
