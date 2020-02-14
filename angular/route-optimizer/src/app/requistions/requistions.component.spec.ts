import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequistionsComponent } from './requistions.component';

describe('RequistionsComponent', () => {
  let component: RequistionsComponent;
  let fixture: ComponentFixture<RequistionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequistionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequistionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
