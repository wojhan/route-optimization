import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastBusinessTripComponent } from './last-business-trip.component';

describe('LastBusinessTripComponent', () => {
  let component: LastBusinessTripComponent;
  let fixture: ComponentFixture<LastBusinessTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LastBusinessTripComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastBusinessTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
