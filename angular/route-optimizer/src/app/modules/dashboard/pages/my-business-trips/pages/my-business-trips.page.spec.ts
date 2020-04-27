import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBusinessTripsPage } from './my-business-trips.page';

describe('MyBusinessTripsComponent', () => {
  let component: MyBusinessTripsPage;
  let fixture: ComponentFixture<MyBusinessTripsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyBusinessTripsPage]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBusinessTripsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
