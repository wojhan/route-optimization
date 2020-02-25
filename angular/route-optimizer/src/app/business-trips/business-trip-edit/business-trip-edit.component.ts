import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BusinessTripsService, BusinessTrip } from '../business-trips.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { map, tap, mergeMap, last } from 'rxjs/operators';
import { Requistion, RequistionsService } from 'src/app/requistions/requistions.service';
import { concat, of } from 'rxjs';
@Component({
  selector: 'app-business-trip-edit',
  templateUrl: './business-trip-edit.component.html',
  styleUrls: ['./business-trip-edit.component.scss']
})
export class BusinessTripEditComponent implements OnInit {
  businessTrip: BusinessTrip;
  businessTripForm: FormGroup;
  requistions: Requistion[];

  pageLoaded;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private businessTripsService: BusinessTripsService,
    private cdRef: ChangeDetectorRef,
    private requistionsService: RequistionsService
  ) {}

  ngOnInit() {
    this.pageLoaded = false;
    const id = +this.route.snapshot.paramMap.get('id');

    this.businessTripForm = new FormGroup({
      startDate: new FormControl('', [Validators.required]),
      finishDate: new FormControl('', [Validators.required]),
      assignee: new FormControl('', [Validators.required]),
      maxDistance: new FormControl('', [Validators.required]),
      requistions: new FormArray([])
    });

    this.requistions = [];
    const getRequistions = this.requistionsService.getRequistions().pipe(tap(requistion => this.requistions.push(requistion)));
    const getBusinessTrip = this.businessTripsService.getBusinessTrip(id).pipe(
      mergeMap(businessTrip => {
        return concat(getRequistions, of(businessTrip));
      }),
      last()
    );

    getBusinessTrip.subscribe({
      next: businessTrip => {
        this.businessTrip = businessTrip;
        this.businessTripForm = new FormGroup({
          startDate: new FormControl(businessTrip.startDate, [Validators.required]),
          finishDate: new FormControl(businessTrip.finishDate, [Validators.required]),
          assignee: new FormControl(businessTrip.assignee, [Validators.required]),
          maxDistance: new FormControl(businessTrip.maxDistance, [Validators.required]),
          requistions: new FormArray([])
        });
        businessTrip.requistions.forEach(requistion => {
          const formArray = this.businessTripForm.get('requistions') as FormArray;
          formArray.push(new FormControl(requistion));
          this.requistions.unshift(requistion);
        });
        this.cdRef.detectChanges();
      },
      error: () => {},
      complete: () => {
        this.pageLoaded = true;
        this.cdRef.detectChanges();
      }
    });
  }

  isFormEdited(): boolean {
    if (this.businessTrip) {
      const { id, distance, duration, estimatedProfit, routes, ...businessTrip } = this.businessTrip;
      businessTrip.requistions.sort((a, b) => a.id - b.id);
      (this.businessTripForm.get('requistions') as FormArray).controls.sort((a, b) => a.value.id - b.value.id);
      return JSON.stringify(this.businessTripForm.value) !== JSON.stringify(businessTrip);
    }
    return false;
  }

  editBusinessTrip(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    const data: any = {};
    if (JSON.stringify(this.businessTrip.assignee) !== JSON.stringify(this.businessTripForm.get('assignee').value)) {
      data.assignee = this.businessTripForm.get('assignee');
    }

    if (JSON.stringify(this.businessTrip.requistions) !== JSON.stringify(this.businessTripForm.get('requistions').value)) {
      data.requistions = this.businessTripForm.get('requistions').value;
    }

    if (JSON.stringify(this.businessTrip.startDate) !== JSON.stringify(this.businessTripForm.get('startDate').value)) {
      data.startDate = this.businessTripForm.get('startDate').value;
    }

    if (JSON.stringify(this.businessTrip.finishDate) !== JSON.stringify(this.businessTripForm.get('finishDate').value)) {
      data.finishDate = this.businessTripForm.get('finishDate').value;
    }

    this.businessTripsService.partialUpdateBusinessTrip(id, data).subscribe(response => {
      this.router.navigate(['/dashboard/business-trips', response.id]);
    });
  }
}
