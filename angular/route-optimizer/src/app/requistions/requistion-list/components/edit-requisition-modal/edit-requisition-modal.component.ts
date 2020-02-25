import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { debounceTime, tap, startWith, switchMap, share } from 'rxjs/operators';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { Company, CompaniesService } from 'src/app/companies/companies.service';

export interface EditRequisitionDialogData {
  requisitionForm: FormGroup;
  title: string;
}

interface AutoCompleteCompany {
  loading: Subject<boolean>;
  results: Company[];
}

@Component({
  selector: 'app-requisition-edit-requisition-modal',
  templateUrl: './edit-requisition-modal.component.html',
  styleUrls: ['./edit-requisition-modal.component.scss']
})
export class EditRequisitionModalComponent implements OnInit {
  availableCompanies: AutoCompleteCompany = { loading: new Subject<boolean>(), results: [] };
  CompanyPageUrl: BehaviorSubject<string> = new BehaviorSubject('http://localhost:8000/api/companies/');

  constructor(
    private companiesService: CompaniesService,
    public dialogRef: MatDialogRef<EditRequisitionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditRequisitionDialogData
  ) {}

  ngOnInit() {
    const companyChanged = this.data.requisitionForm.get('company').valueChanges.pipe(
      debounceTime(150),
      tap(() => (this.availableCompanies.results = [])),
      startWith(this.data.requisitionForm.get('company').value),
      switchMap(searchCriteria => {
        if (searchCriteria instanceof Object || !searchCriteria) {
          this.availableCompanies.loading.next(false);
          return of();
        }

        if (searchCriteria.length && searchCriteria.length < 4) {
          this.availableCompanies.loading.next(false);
          return of();
        }

        return this.companiesService.getCompanies({ search: searchCriteria }).pipe(tap(() => this.availableCompanies.loading.next(true)));
      }),
      share()
    );

    companyChanged.subscribe((data: Company) => {
      this.availableCompanies.loading.next(true);
      this.availableCompanies.results.push(data);
      this.availableCompanies.loading.next(false);
    });
  }

  displayCompany(company?: Company): string | undefined {
    if (!company) {
      return undefined;
    }

    console.log(company);

    return company.nameShort;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
