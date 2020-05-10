import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripDetailPage } from './business-trip-detail.page';

describe('BusinessTripDetailComponent', () => {
  let component: BusinessTripDetailPage;
  let fixture: ComponentFixture<BusinessTripDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTripDetailPage]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTripDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
