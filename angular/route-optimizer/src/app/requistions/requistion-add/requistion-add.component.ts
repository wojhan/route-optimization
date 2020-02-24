import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { RequistionsService, Requistion } from '../requistions.service';
import { Observable } from 'rxjs';
import { Company, CompaniesService } from 'src/app/companies/companies.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-requistion-add',
  templateUrl: './requistion-add.component.html',
  styleUrls: ['./requistion-add.component.scss']
})
export class RequistionAddComponent implements OnInit {
  requisitionForm: FormGroup;

  availableCompanies: Observable<Company[]>;

  constructor(
    private requisitionsService: RequistionsService,
    private companiesService: CompaniesService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.requisitionForm = new FormGroup({
      estimatedProfit: new FormControl('', [Validators.required]),
      company: new FormControl('', [Validators.required])
    });

    // this.availableCompanies = this.companiesService.getCompanies();

    // this.availableCompanies.subscribe(data => {
    //   console.log(data);
    // });
  }

  addRequistion(requisition: FormGroup) {
    const newRequisition: Requistion = new Requistion();

    newRequisition.estimatedProfit = parseInt(requisition.get('estimatedProfit').value, 10);
    newRequisition.company = requisition.get('company').value;
    newRequisition.createdBy = !this.userService.isStaff.getValue() ? this.userService.user.getValue().id : null;

    if (newRequisition.company instanceof Object) {
      this.requisitionsService.addRequisition(newRequisition).subscribe(response => {
        console.log(response);
      });
    }
    // console.log(requistion);
  }
}
