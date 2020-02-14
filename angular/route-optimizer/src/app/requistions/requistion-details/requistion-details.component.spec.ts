import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequistionDetailsComponent } from './requistion-details.component';

describe('RequistionDetailsComponent', () => {
  let component: RequistionDetailsComponent;
  let fixture: ComponentFixture<RequistionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequistionDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequistionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
