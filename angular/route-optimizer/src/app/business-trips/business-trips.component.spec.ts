import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripsComponent } from './business-trips.component';

describe('BusinessTripsComponent', () => {
  let component: BusinessTripsComponent;
  let fixture: ComponentFixture<BusinessTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTripsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
