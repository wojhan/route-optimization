import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Employee, EmployeesService } from 'src/app/employees/employees.service';
import { Observable, merge, BehaviorSubject, Subject, of, concat, from } from 'rxjs';
import { startWith, map, debounceTime, switchMap, share, filter, tap, finalize } from 'rxjs/operators';
import { Page } from 'src/app/pagination';
import { Requistion, RequistionsService } from 'src/app/requistions/requistions.service';
import { Company } from 'src/app/companies/companies.service';

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
  public submitButton;

  @Input()
  public submitButtonEnabled = true;

  requistions: Requistion[] = [];
  availableEmployees: AutoCompleteEmployee = { loading: new Subject<boolean>(), results: [] };

  constructor(
    private employeesService: EmployeesService,
    private requisitionsService: RequistionsService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const assigneeChanged = this.businessTripForm.get('assignee').valueChanges.pipe(
      debounceTime(150),
      filter(assignee => assignee !== null),
      tap(() => (this.availableEmployees.results = [])),
      startWith(this.businessTripForm.get('assignee').value),
      switchMap(searchCriteria => {
        if (searchCriteria instanceof Object || !searchCriteria) {
          this.availableEmployees.loading.next(false);
          return of();
        }

        if (searchCriteria.length && searchCriteria.length < 4) {
          this.availableEmployees.loading.next(false);
          return of();
        }

        return this.employeesService.getEmployees({ search: searchCriteria }).pipe(tap(() => this.availableEmployees.loading.next(true)));
      }),
      share()
    );

    const assigneeChosen = concat(
      of(this.businessTripForm.get('assignee').value),
      this.businessTripForm.get('assignee').valueChanges.pipe(filter((value: string | Employee) => value instanceof Object))
    ).pipe(filter(assignee => assignee !== null));

    assigneeChanged.subscribe((data: Employee) => {
      this.availableEmployees.loading.next(true);
      this.availableEmployees.results.push(data);
      this.availableEmployees.loading.next(false);
    });

    const requisitions = assigneeChosen.pipe(
      tap(() => (this.requistions = [])),
      switchMap(() =>
        concat(
          from(this.businessTripForm.get('requistions').value).pipe(map((requisition: Requistion) => ({ requisition, checked: true }))),
          this.requisitionsService
            .getRequisitions(this.businessTripForm.get('assignee').value.id)
            .pipe(map((requisition: Requistion) => ({ requisition, checked: false })))
        ).pipe(
          finalize(() => {
            this.cdRef.detectChanges();
          })
        )
      )
    );

    requisitions.subscribe({
      next: data => {
        this.requistions.push(data.requisition);
        this.cdRef.detectChanges();
      }
    });
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

interface AutoCompleteEmployee {
  loading: Subject<boolean>;
  results: Employee[];
}
