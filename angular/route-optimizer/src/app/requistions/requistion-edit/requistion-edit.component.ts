import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequistionsService, Requistion } from '../requistions.service';
import { UserService } from 'src/app/shared/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-requistion-edit',
  templateUrl: './requistion-edit.component.html',
  styleUrls: ['./requistion-edit.component.scss']
})
export class RequistionEditComponent implements OnInit {
  requisition: Requistion;
  requisitionForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private requisitionsService: RequistionsService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');

    this.requisitionsService.getRequisition(id).subscribe((requisition: Requistion) => {
      const createdBy = requisition.createdBy;

      if (
        (createdBy && createdBy !== this.userService.user.getValue().id && !this.userService.isStaff.getValue()) ||
        (!createdBy && !this.userService.isStaff.getValue())
      ) {
        this.router.navigate(['dashboard', 'requisitions', id]);
      } else {
        this.requisition = requisition;
        this.requisitionForm = new FormGroup({
          company: new FormControl(requisition.company, [Validators.required]),
          estimatedProfit: new FormControl(requisition.estimatedProfit, [Validators.required])
        });

        this.cdRef.detectChanges();
      }
    });
  }

  isFormEdited(): boolean {
    // console.log(
    //   JSON.stringify(this.requisition),
    //   JSON.stringify(this.requisitionForm.value),
    //   JSON.stringify(this.requisition) === JSON.stringify(this.requisitionForm.value)
    // );
    if (this.requisitionForm) {
      const requisition = { company: this.requisition.company, estimatedProfit: this.requisition.estimatedProfit };
      return !(JSON.stringify(requisition) === JSON.stringify(this.requisitionForm.value));
    }
    return false;
  }

  editRequisition(): void {
    const values = this.requisitionForm.value;
    const editedRequisition: Requistion = Object.assign(new Requistion(), values);
    editedRequisition.assignmentDate = this.requisition.assignmentDate;
    editedRequisition.createdBy = this.requisition.createdBy;
    editedRequisition.id = this.requisition.id;

    this.requisitionsService.updateRequisition(editedRequisition).subscribe();
  }
}
