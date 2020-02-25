import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Page } from 'src/app/pagination';
import { Employee, EmployeesService } from 'src/app/employees/employees.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inactive-employees',
  templateUrl: './inactive-employees.component.html',
  styleUrls: ['./inactive-employees.component.scss']
})
export class InactiveEmployeesComponent implements OnInit {
  @Input()
  page: Observable<Page<Employee>>;
  @Input()
  pageUrl: BehaviorSubject<string>;
  @Input()
  filterForm: FormGroup;

  @Output()
  pageChange: EventEmitter<string> = new EventEmitter();

  constructor(private employeesService: EmployeesService) {}

  ngOnInit() {}

  onPageChanged(page: string) {
    this.pageChange.emit(page);
  }
}
