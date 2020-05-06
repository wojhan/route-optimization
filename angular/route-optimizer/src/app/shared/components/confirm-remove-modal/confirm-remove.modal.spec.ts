import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRemoveModal } from './confirm-remove.modal';

describe('ConfirmRemoveModalComponent', () => {
  let component: ConfirmRemoveModal;
  let fixture: ComponentFixture<ConfirmRemoveModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmRemoveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRemoveModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
