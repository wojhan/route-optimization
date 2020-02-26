import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BusinessTripsService, BusinessTrip } from '../business-trips.service';
import { of, Observable } from 'rxjs';
import { Employee, EmployeesService } from 'src/app/employees/employees.service';
import { RequistionsService, Requistion } from 'src/app/requistions/requistions.service';
import { WebSocketService } from 'src/app/shared/services/websocket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-trip-add',
  templateUrl: './business-trip-add.component.html',
  styleUrls: ['./business-trip-add.component.scss']
})
export class BusinessTripAddComponent implements OnInit {
  businessTripForm: FormGroup;

  myControl = new FormControl();
  options: Employee[];
  filteredOptions: Observable<Employee[]>;
  requistions: Requistion[];

  constructor(
    private businessTripsService: BusinessTripsService,
    private requistionsService: RequistionsService,
    private cdRef: ChangeDetectorRef,
    private wsService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.businessTripForm = new FormGroup({
      startDate: new FormControl('', [Validators.required]),
      finishDate: new FormControl('', [Validators.required]),
      assignee: new FormControl(null, [Validators.required]),
      maxDistance: new FormControl('', [Validators.required]),
      requistions: new FormArray([])
    });

    this.requistions = [];

    this.requistionsService.getRequistions().subscribe({
      next: requistion => {
        this.requistions.push(requistion);
      },
      complete: () => {
        this.cdRef.detectChanges();
      }
    });
  }

  addBusinessTrip(): void {
    const businessTrip = Object.assign(new BusinessTrip(), {
      startDate: this.businessTripForm.get('startDate').value,
      finishDate: this.businessTripForm.get('finishDate').value,
      maxDistance: this.businessTripForm.get('maxDistance').value
    });

    const updateValues = {
      assignee: {
        user: this.businessTripForm.get('assignee').value
      },
      requistions: []
    };

    (this.businessTripForm.get('requistions') as FormArray).controls.forEach(requistion => {
      updateValues.requistions.push(requistion.value);
    });

    this.businessTripsService.addBusinessTrip(businessTrip).subscribe(response => {
      this.businessTripsService.partialUpdateBusinessTrip(response.id, updateValues).subscribe(() => {
        this.router.navigate(['/dashboard/business-trips', response.id]);
      });
    });
  }
}
