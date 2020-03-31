import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastBusinessTripsComponent } from './past-business-trips.component';

describe('PastBusinessTripsComponent', () => {
  let component: PastBusinessTripsComponent;
  let fixture: ComponentFixture<PastBusinessTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PastBusinessTripsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastBusinessTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
