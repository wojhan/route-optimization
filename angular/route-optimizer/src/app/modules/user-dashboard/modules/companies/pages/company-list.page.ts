import { Component, OnDestroy, OnInit } from '@angular/core';
import { faEllipsisV, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { debounceTime, startWith, switchMap, share, tap, delay, filter } from 'rxjs/operators';

import { Company } from '@route-optimizer/core/models/Company';
import { ConfirmRemoveModal } from '@route-optimizer/shared/components/confirm-remove-modal/confirm-remove.modal';
import { Page } from '@route-optimizer/core/models/Page';
import { CompanyService } from '@route-optimizer/core/services/company.service';
import { FetchableCompany } from '@route-optimizer/core/models/FetchableCompany';
import { environment } from '@route-optimizer/environment/environment';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.page.html'
})
export class CompanyListPage implements OnInit, OnDestroy {
  faEllipsisV: IconDefinition = faEllipsisV;

  filterForm: FormGroup;
  page: Observable<Page<Company>>;
  pageUrl: BehaviorSubject<string>;
  companyPageUrl: string = environment.apiUrl + `api/companies/?format=json&page_size=${environment.defaultPaginationSize}`;
  companies: FetchableCompany = { data: null, loading: true };

  constructor(private companyService: CompanyService, private toastr: ToastrService, private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      search: new FormControl()
    });

    this.pageUrl = new BehaviorSubject<string>(this.companyPageUrl + '&page=1');

    this.page = this.getCompanyPage();
    this.page.subscribe((page: Page<Company>) => this.updatePage(page));
  }

  ngOnDestroy() {}

  private getCompanyPage(): Observable<Page<Company>> {
    return merge(this.filterForm.valueChanges.pipe(debounceTime(200), startWith(this.filterForm.value)), this.pageUrl).pipe(
      tap(() => (this.companies.loading = true)),
      delay(200),
      switchMap(urlOrFilter => this.companyService.list(urlOrFilter)),
      share(),
      untilComponentDestroyed(this)
    );
  }

  private updatePage(page: Page<Company>) {
    this.companies.data = page.results;
    this.companies.loading = false;
  }

  edit(companyId: number): void {
    this.router.navigate(['/dashboard/companies', companyId, 'edit']);
  }

  canEditCompany(company: Company): boolean {
    return this.companyService.canEdit(company);
  }

  remove(company: Company): void {
    const dialogRef = this.dialog.open(ConfirmRemoveModal, {
      width: '250px',
      data: {
        content: `Czy na pewno chcesz usunąć firmę ${company.nameShort}?`,
        ok: true
      }
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(t => !!t),
        switchMap(() => this.companyService.deleteCompany(company.id)),
        untilComponentDestroyed(this)
      )
      .subscribe(() => {
        this.onPageChanged(this.pageUrl.getValue());
        this.toastr.success(`Usunięto firmę ${company.nameShort}.`);
      });
  }

  onPageChanged(page: string) {
    this.pageUrl.next(page);
  }
}
