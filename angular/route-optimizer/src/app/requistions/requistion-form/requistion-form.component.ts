import {
  Component,
  OnInit,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Output,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, startWith, filter, switchMap, share, tap, map } from 'rxjs/operators';
import { Company, CompaniesService } from 'src/app/companies/companies.service';
import { Observable, merge, BehaviorSubject, EMPTY, of, Subject, zip } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-requistion-form',
  templateUrl: './requistion-form.component.html',
  styleUrls: ['./requistion-form.component.scss']
})
export class RequistionFormComponent implements OnInit, OnChanges {
  @Output()
  public formChanged: EventEmitter<FormGroup> = new EventEmitter();

  @Output()
  public formSent: EventEmitter<FormGroup> = new EventEmitter();

  @Input()
  public requsitionForm: FormGroup;

  @Input()
  public submitButton;

  @Input()
  public submitButtonEnabled = true;

  companiesLoading;

  availableCompanies: AutoCompleteCompany = { loading: new Subject<boolean>(), results: [], searched: false };
  CompanyPageUrl: BehaviorSubject<string> = new BehaviorSubject('http://localhost:8000/api/companies/');

  constructor(private companiesService: CompaniesService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    // this.requsitionForm = new FormGroup({
    //   company: new FormControl(''),
    //   estimatedProfit: new FormControl('')
    // });
    // if (this.requsitionForm) {
    //   const companyChanged = this.requsitionForm.get('company').valueChanges.pipe(
    //     debounceTime(150),
    //     tap(() => (this.availableCompanies.results = [])),
    //     startWith(this.requsitionForm.get('company').value),
    //     switchMap(searchCriteria => {
    //       if (searchCriteria instanceof Object || !searchCriteria) {
    //         this.availableCompanies.loading.next(false);
    //         return of();
    //       }
    //       if (searchCriteria.length && searchCriteria.length < 4) {
    //         this.availableCompanies.loading.next(false);
    //         return of();
    //       }
    //       return this.companiesService.getCompanies({ search: searchCriteria }).pipe(tap(() => this.availableCompanies.loading.next(true)));
    //     }),
    //     share()
    //   );
    //   companyChanged.subscribe((data: Company) => {
    //     this.availableCompanies.loading.next(true);
    //     this.availableCompanies.results.push(data);
    //     this.availableCompanies.loading.next(false);
    //   });
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.requsitionForm) {
      const change = changes.requsitionForm;

      if (change.currentValue) {
        const companyChanged = this.requsitionForm.get('company').valueChanges.pipe(
          debounceTime(150),
          tap(() => (this.availableCompanies.results = [])),
          startWith(this.requsitionForm.get('company').value),
          switchMap(searchCriteria => {
            if (searchCriteria instanceof Object || !searchCriteria) {
              this.availableCompanies.loading.next(false);
              return of();
            }

            if (searchCriteria.length && searchCriteria.length < 4) {
              this.availableCompanies.loading.next(false);
              return of();
            }

            return this.companiesService
              .getCompanies({ search: searchCriteria })
              .pipe(tap(() => this.availableCompanies.loading.next(true)));
          }),
          share()
        );

        companyChanged.subscribe((data: Company) => {
          this.availableCompanies.loading.next(true);
          this.availableCompanies.results.push(data);
          this.availableCompanies.loading.next(false);
        });

        this.requsitionForm.valueChanges.pipe(debounceTime(300)).subscribe((data: any) => {
          this.formChanged.emit(data);
        });
      }
    }
  }

  displayCompany(company?: Company): string | undefined {
    if (!company) {
      return undefined;
    }

    console.log(company);

    return company.nameShort;
  }

  sendForm() {
    this.formSent.emit(this.requsitionForm);
  }
}

interface AutoCompleteCompany {
  loading: Subject<boolean>;
  searched: boolean;
  results: Company[];
}
