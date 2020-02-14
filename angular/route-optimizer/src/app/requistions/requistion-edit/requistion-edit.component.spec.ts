import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequistionEditComponent } from './requistion-edit.component';

describe('RequistionEditComponent', () => {
  let component: RequistionEditComponent;
  let fixture: ComponentFixture<RequistionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequistionEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequistionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
