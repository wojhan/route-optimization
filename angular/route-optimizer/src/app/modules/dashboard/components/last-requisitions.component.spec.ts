import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastRequisitionsComponent } from './last-requisitions.component';

describe('LastRequisitionsComponent', () => {
  let component: LastRequisitionsComponent;
  let fixture: ComponentFixture<LastRequisitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LastRequisitionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastRequisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
