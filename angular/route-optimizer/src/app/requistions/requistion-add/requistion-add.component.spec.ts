import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequistionAddComponent } from './requistion-add.component';

describe('RequistionAddComponent', () => {
  let component: RequistionAddComponent;
  let fixture: ComponentFixture<RequistionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequistionAddComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequistionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
