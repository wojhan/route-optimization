import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBusinessTripsComponent } from './my-business-trips.component';

describe('MyBusinessTripsComponent', () => {
  let component: MyBusinessTripsComponent;
  let fixture: ComponentFixture<MyBusinessTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyBusinessTripsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBusinessTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
