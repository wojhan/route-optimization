import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripCardsComponent } from './business-trip-cards.component';

describe('BusinessTripCardsComponent', () => {
  let component: BusinessTripCardsComponent;
  let fixture: ComponentFixture<BusinessTripCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTripCardsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTripCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
