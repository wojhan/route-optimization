import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBusinessTripsListComponent } from './employee-business-trips-list.component';

describe('EmployeeBusinessTripsListComponent', () => {
  let component: EmployeeBusinessTripsListComponent;
  let fixture: ComponentFixture<EmployeeBusinessTripsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeBusinessTripsListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeBusinessTripsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
