import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBusinessTripsComponent } from './current-business-trips.component';

describe('CurrentBusinessTripsComponent', () => {
  let component: CurrentBusinessTripsComponent;
  let fixture: ComponentFixture<CurrentBusinessTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentBusinessTripsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentBusinessTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
