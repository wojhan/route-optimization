import { Component, OnInit } from "@angular/core";
import {
  faInfoCircle,
  faTrash,
  faEdit,
  faEllipsisV,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { CompaniesService, Company } from "../companies.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { Page } from "src/app/pagination";
import {
  debounceTime,
  merge,
  startWith,
  switchMap,
  share
} from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";

@Component({
  selector: "app-company-list",
  templateUrl: "./company-list.component.html",
  styleUrls: ["./company-list.component.scss"]
})
export class CompanyListComponent implements OnInit {
  faInfoCircle: IconDefinition = faInfoCircle;
  faThrash: IconDefinition = faTrash;
  faEdit: IconDefinition = faEdit;
  faEllipsisV: IconDefinition = faEllipsisV;

  filterForm: FormGroup;
  page: Observable<Page<Company>>;
  pageUrl: BehaviorSubject<string> = new BehaviorSubject<string>(
    `${environment.apiUrl}api/companies/?format=json&page=1&page_size=40`
  );

  constructor(
    private companiesService: CompaniesService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      search: new FormControl()
    });
    this.page = this.filterForm.valueChanges.pipe(
      debounceTime(200),
      startWith(this.filterForm.value),
      merge(this.pageUrl),
      switchMap(urlOrFilter => this.companiesService.list(urlOrFilter)),
      share()
    );
  }

  edit(companyId: number): void {
    this.router.navigate([`/dashboard/company/edit/${companyId}`]);
  }

  remove(company: Company): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: "250px",
      data: {
        content: `Czy na pewno chcesz usunąć firmę ${company.nameShort}?`,
        ok: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.companiesService.deleteCompany(company).subscribe(data => {
          this.onPageChanged(this.pageUrl.getValue());
        });
      }
    });
  }

  onPageChanged(page: string) {
    this.pageUrl.next(
      `${environment.apiUrl}api/companies/?format=json&page=${page}&page_size=40`
    );
  }
}
