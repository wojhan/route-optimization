import { Component, OnInit } from '@angular/core';
import { IconDefinition, faTrash, faInfoCircle, faEdit, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/pagination';
import { RequistionsService, Requistion } from '../requistions.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { debounceTime, startWith, switchMap, share } from 'rxjs/operators';

@Component({
  selector: 'app-requistion-list',
  templateUrl: './requistion-list.component.html',
  styleUrls: ['./requistion-list.component.scss']
})
export class RequistionListComponent implements OnInit {
  faInfoCircle: IconDefinition = faInfoCircle;
  faThrash: IconDefinition = faTrash;
  faEdit: IconDefinition = faEdit;
  faEllipsisV: IconDefinition = faEllipsisV;

  filterForm: FormGroup;
  page: Observable<Page<Requistion>>;
  pageUrl: BehaviorSubject<string> = new BehaviorSubject<string>(`${environment.apiUrl}api/requistions/?format=json&page=1&page_size=40`);

  constructor(private requisitionsService: RequistionsService, private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      search: new FormControl()
    });
    this.page = merge(this.filterForm.valueChanges.pipe(debounceTime(200), startWith(this.filterForm.value)), this.pageUrl).pipe(
      switchMap(urlOrFilter => this.requisitionsService.list(urlOrFilter)),
      share()
    );
  }

  canEditRequisition(requisition: Requistion): boolean {
    return this.requisitionsService.canEditRequisition(requisition);
  }

  onPageChanged(page: string) {
    this.pageUrl.next(`${environment.apiUrl}api/requistions/?format=json&page=${page}&page_size=40`);
  }
}
