import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRequisitionModalComponent } from './edit-requisition-modal.component';

describe('EditRequisitionModalComponent', () => {
  let component: EditRequisitionModalComponent;
  let fixture: ComponentFixture<EditRequisitionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditRequisitionModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRequisitionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
