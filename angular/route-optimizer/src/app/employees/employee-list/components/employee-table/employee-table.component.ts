import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IconDefinition, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { Page } from 'src/app/pagination';
import { Employee } from 'src/app/employees/employees.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss']
})
export class EmployeeTableComponent implements OnInit {
  faEllipsisV: IconDefinition = faEllipsisV;

  @Input()
  filterForm: FormGroup;

  @Input()
  page: Observable<Page<Employee>>;

  @Input()
  pageUrl: BehaviorSubject<string>;

  @Output()
  pageChanged: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onPageChanged(page: string) {
    console.log(page);
    this.pageChanged.emit(page);
  }
}
