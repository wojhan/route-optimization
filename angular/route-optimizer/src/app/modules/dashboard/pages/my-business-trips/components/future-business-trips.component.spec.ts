import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureBusinessTripsComponent } from './future-business-trips.component';

describe('FutureBusinessTripsComponent', () => {
  let component: FutureBusinessTripsComponent;
  let fixture: ComponentFixture<FutureBusinessTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FutureBusinessTripsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FutureBusinessTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
