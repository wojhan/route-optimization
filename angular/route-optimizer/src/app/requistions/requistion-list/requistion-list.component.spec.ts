import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequistionListComponent } from './requistion-list.component';

describe('RequistionListComponent', () => {
  let component: RequistionListComponent;
  let fixture: ComponentFixture<RequistionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequistionListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequistionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
