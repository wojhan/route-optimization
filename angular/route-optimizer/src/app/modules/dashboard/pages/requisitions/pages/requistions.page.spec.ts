import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequistionsPage } from './requistions.page';

describe('RequistionsComponent', () => {
  let component: RequistionsPage;
  let fixture: ComponentFixture<RequistionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequistionsPage]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequistionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
