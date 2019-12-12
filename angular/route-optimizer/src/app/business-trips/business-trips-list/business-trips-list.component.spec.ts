import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripsListComponent } from './business-trips-list.component';

describe('BusinessTripsListComponent', () => {
  let component: BusinessTripsListComponent;
  let fixture: ComponentFixture<BusinessTripsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTripsListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTripsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
