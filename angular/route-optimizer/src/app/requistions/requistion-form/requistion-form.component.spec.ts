import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequistionFormComponent } from './requistion-form.component';

describe('RequistionFormComponent', () => {
  let component: RequistionFormComponent;
  let fixture: ComponentFixture<RequistionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequistionFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequistionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
