import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  @Output()
  public formSent: EventEmitter<FormGroup> = new EventEmitter();

  @Input()
  public employeeForm: FormGroup;

  @Input()
  public submitButton;

  constructor() {}

  ngOnInit() {}

  sendForm() {
    this.formSent.emit(this.employeeForm);
  }
}
