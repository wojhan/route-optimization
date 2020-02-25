import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Employee, EmployeesService } from 'src/app/employees/employees.service';
import { Observable, merge, BehaviorSubject } from 'rxjs';
import { startWith, map, debounceTime, switchMap, share, filter } from 'rxjs/operators';
import { Page } from 'src/app/pagination';
import { Requistion } from 'src/app/requistions/requistions.service';

@Component({
  selector: 'app-business-trip-form',
  templateUrl: './business-trip-form.component.html',
  styleUrls: ['./business-trip-form.component.scss']
})
export class BusinessTripFormComponent implements OnInit {
  @Output()
  public formSent: EventEmitter<FormGroup> = new EventEmitter();

  @Input()
  public businessTripForm: FormGroup;

  @Input()
  public requistions: Requistion[];

  @Input()
  public submitButton;

  @Input()
  public submitButtonEnabled = true;

  options: Employee[];
  filteredOptions: Observable<Employee[]>;

  assigneeFormControl: FormControl;

  assigneePage: Observable<Page<Employee>>;
  assigneePageUrl: BehaviorSubject<string> = new BehaviorSubject('http://localhost:8000/api/employees/');

  constructor(private employeesService: EmployeesService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    // this.assigneePage = merge(
    //   this.businessTripForm.get('assignee').valueChanges.pipe(debounceTime(200), startWith(this.businessTripForm.get('assignee').value)),
    //   this.assigneePageUrl
    // ).pipe(
    //   filter(() => !(this.businessTripForm.get('assignee').value instanceof Object)),
    //   switchMap(urlOrFilter =>
    //     this.employeesService.list(
    //       'http://localhost:8000/api/employees/',
    //       this.businessTripForm.get('assignee').value === '' ? 'http://localhost:8000/api/employees/' : { search: urlOrFilter }
    //     )
    //   ),
    //   share()
    // );
    // this.assigneePage.subscribe(data => {
    //   this.options = data.results;
    // });
  }

  displayFn(employee?: Employee): string | undefined {
    if (!employee) {
      return undefined;
    }

    const { firstName, lastName } = employee;
    return `${firstName} ${lastName}`;
  }

  onAllCheckChange(event) {
    const formArray: FormArray = this.businessTripForm.get('requistions') as FormArray;

    if (event.source.checked) {
      this.requistions.forEach(requistion => {
        formArray.push(new FormControl(requistion));
      });
    } else {
      this.businessTripForm.setControl('requistions', new FormArray([]));
    }
  }

  isRequistionChecked(requistion) {
    const formArray: FormArray = this.businessTripForm.get('requistions') as FormArray;
    if (formArray.controls.length > 0) {
      const foundRequistion = formArray.controls.find(element => JSON.stringify(element.value) === JSON.stringify(requistion));
      return foundRequistion;
    } else {
      return false;
    }
  }

  onCheckChange(event) {
    const formArray: FormArray = this.businessTripForm.get('requistions') as FormArray;

    /* Selected */
    if (event.source.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.source.value));
    } else {
      /* unselected */
      // find the unselected element
      let i = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value === event.source.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  sendForm() {
    this.formSent.emit(this.businessTripForm);
  }
}
