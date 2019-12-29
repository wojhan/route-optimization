import { Component, OnInit } from '@angular/core';
import { IconDefinition, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { Page } from 'src/app/pagination';
import { BusinessTrip, BusinessTripsService } from '../business-trips.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { debounceTime, startWith, switchMap, share, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-business-trips-list',
  templateUrl: './business-trips-list.component.html',
  styleUrls: ['./business-trips-list.component.scss']
})
export class BusinessTripsListComponent implements OnInit {
  faEllipsisV: IconDefinition = faEllipsisV;

  filterForm: FormGroup;
  page: Observable<Page<BusinessTrip>>;
  pageUrl: BehaviorSubject<string>;
  employeeId: number;

  constructor(private businessTripsService: BusinessTripsService, private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit() {
    this.employeeId = +this.route.snapshot.paramMap.get('employeeId');
    this.pageUrl = new BehaviorSubject<string>(`${environment.apiUrl}api/business-trips/?format=json&page=1&page_size=40`);

    this.filterForm = new FormGroup({
      search: new FormControl()
    });

    this.page = merge(this.filterForm.valueChanges.pipe(debounceTime(200), startWith(this.filterForm.value)), this.pageUrl).pipe(
      switchMap(urlOrFilter => this.businessTripsService.list(this.employeeId, urlOrFilter)),
      map((page: Page<BusinessTrip>) => {
        page.results = page.results.filter((businessTrip: BusinessTrip) => businessTrip.assignee);
        page.results.map((businessTrip: any) => (businessTrip.assignee = businessTrip.assignee.user));
        return page;
      }),
      share()
    );
  }

  remove(businessTrip: BusinessTrip): void {
    // this.businessTripsService.deleteBusinessTrip(businessTripId).subscribe(response => {
    //   // TODO: Verify response
    //   this.pageUrl.next(this.pageUrl.getValue());
    // });
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '250px',
      data: {
        content: `Czy na pewno chcesz usunąć delegację ${businessTrip.startDate} - ${businessTrip.finishDate} pracownika ${businessTrip.assignee.firstName} ${businessTrip.assignee.lastName}?`,
        ok: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.businessTripsService.deleteBusinessTrip(businessTrip.id).subscribe(data => {
          this.onPageChanged(this.pageUrl.getValue());
        });
      }
    });
  }

  onPageChanged(page: string): void {
    this.pageUrl.next(`${environment.apiUrl}api/business-trips/?format=json&page=${page}&page_size=40`);
  }
}
