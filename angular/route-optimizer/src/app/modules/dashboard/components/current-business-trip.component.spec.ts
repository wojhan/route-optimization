import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBusinessTripComponent } from './current-business-trip.component';

describe('CurrentBusinessTripComponent', () => {
  let component: CurrentBusinessTripComponent;
  let fixture: ComponentFixture<CurrentBusinessTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentBusinessTripComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentBusinessTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
