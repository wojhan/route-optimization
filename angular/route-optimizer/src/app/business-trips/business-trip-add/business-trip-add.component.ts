import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BusinessTrip, BusinessTripsService } from '../business-trips.service';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/employees/employees.service';
import { Requisition, RequistionsService } from 'src/app/requistions/requistions.service';
import { WebSocketService } from 'src/app/shared/services/websocket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-trip-add',
  templateUrl: './business-trip-add.component.html',
  styleUrls: ['./business-trip-add.component.scss']
})
export class BusinessTripAddComponent implements OnInit {
  businessTripForm: FormGroup;

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
