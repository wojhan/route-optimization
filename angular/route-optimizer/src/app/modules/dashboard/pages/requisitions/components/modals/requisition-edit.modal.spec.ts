import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionEditModal } from './requisition-edit.modal';

describe('EditRequisitionModalComponent', () => {
  let component: RequisitionEditModal;
  let fixture: ComponentFixture<RequisitionEditModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequisitionEditModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionEditModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
