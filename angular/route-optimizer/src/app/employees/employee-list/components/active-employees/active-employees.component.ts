import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { Page } from 'src/app/pagination';
import { Employee, EmployeesService } from 'src/app/employees/employees.service';
import { debounceTime, startWith, switchMap, share } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-active-employees',
  templateUrl: './active-employees.component.html',
  styleUrls: ['./active-employees.component.scss']
})
export class ActiveEmployeesComponent implements OnInit {
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
