import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Employee, EmployeesService } from '../employees.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit {
  employee: Employee = new Employee();

  employeeForm: FormGroup;

  constructor(private route: ActivatedRoute, private employeesService: EmployeesService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');

    this.employeesService.getEmployee(id).subscribe(employee => {
      this.employee = employee;
      this.employeeForm = new FormGroup({
        username: new FormControl(this.employee.username, [Validators.required]),
        email: new FormControl(this.employee.email, [Validators.required, Validators.email]),
        firstName: new FormControl(this.employee.firstName, [Validators.required]),
        lastName: new FormControl(this.employee.lastName, [Validators.required])
      });
      this.cdRef.detectChanges();
    });
  }

  editEmployee(form: FormGroup) {
    const employee = Object.assign(new Employee(), form.value);
    employee.id = this.employee.id;

    this.employeesService.editEmployee(employee).subscribe(response => {
      console.log(response);
    });
  }
}
