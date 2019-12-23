import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBusinessTripsComponent } from './employee-business-trips.component';

describe('EmployeeBusinessTripsComponent', () => {
  let component: EmployeeBusinessTripsComponent;
  let fixture: ComponentFixture<EmployeeBusinessTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeBusinessTripsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeBusinessTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
