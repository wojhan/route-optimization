import { Component, OnInit } from '@angular/core';
import { faEdit, faEllipsisV, faInfoCircle, faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, EMPTY, merge, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material';
import { debounceTime, share, startWith, switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { Page } from '../../../../../core/models/Page';
import { Requisition } from '../../../../../core/models/Requisition';
import { RequisitionService } from '../../../../../core/services/requisition.service';
import { RequisitionEditModal } from '../components/modals/requisition-edit.modal';

@Component({
  selector: 'app-requistion-list',
  templateUrl: './requistion-list.page.html'
})
export class RequistionListPage implements OnInit {
  faInfoCircle: IconDefinition = faInfoCircle;
  faThrash: IconDefinition = faTrash;
  faEdit: IconDefinition = faEdit;
  faEllipsisV: IconDefinition = faEllipsisV;

  filterForm: FormGroup;
  page: Observable<Page<Requisition>>;
  pageUrl: BehaviorSubject<string>;

  constructor(private requisitionsService: RequisitionService, private userService: UserService, public dialog: MatDialog) {}

  ngOnInit() {
    this.pageUrl = new BehaviorSubject(this.requisitionsService.getApiRequisitionsPageUrl());
    this.filterForm = new FormGroup({
      search: new FormControl()
    });
    this.page = merge(this.filterForm.valueChanges.pipe(debounceTime(200), startWith(this.filterForm.value)), this.pageUrl).pipe(
      switchMap(urlOrFilter => this.requisitionsService.list(urlOrFilter)),
      share()
    );
  }

  canEditRequisition(requisition: Requisition): boolean {
    return this.requisitionsService.canEditRequisition(requisition);
  }

  onPageChanged(page: string) {
    this.pageUrl.next(this.requisitionsService.getApiRequisitionsPageUrl(page));
  }

  editRequisition(requisition: Requisition): void {
    const requisitionForm: FormGroup = new FormGroup({
      company: new FormControl(requisition.company, [Validators.required]),
      estimatedProfit: new FormControl(requisition.estimatedProfit, [Validators.required])
    });

    const dialogRef = this.dialog.open(RequisitionEditModal, {
      width: '400px',
      data: {
        title: 'Edycja oferty',
        requisitionForm
      }
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap(result => {
          if (result) {
            const values = result.value;
            const editedRequisition: Requisition = Object.assign(new Requisition(), values);
            editedRequisition.assignmentDate = requisition.assignmentDate;
            editedRequisition.createdBy = requisition.createdBy;
            editedRequisition.id = requisition.id;

            return this.requisitionsService.updateRequisition(editedRequisition);
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe({
        next: () => {
          this.onPageChanged(this.pageUrl.getValue());
        }
      });
  }

  addRequisition(): void {
    const requisitionForm: FormGroup = new FormGroup({
      company: new FormControl(null, [Validators.required]),
      estimatedProfit: new FormControl(null, [Validators.required])
    });

    const dialogRef = this.dialog.open(RequisitionEditModal, {
      width: '400px',
      data: {
        title: 'Dodaj nową ofertę',
        requisitionForm
      }
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap(result => {
          if (result) {
            const values = result.value;
            const newRequisition: Requisition = Object.assign(new Requisition(), values);
            // TODO: Add created by
            // newRequisition.createdBy = !this.userService.isStaff.getValue() ? this.userService.user.getValue().id : null;

            return this.requisitionsService.addRequisition(newRequisition);
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe({
        next: () => {
          this.onPageChanged(this.pageUrl.getValue());
        }
      });
  }

  deleteRequisition(requisition: Requisition): void {
    // const dialogRef = this.dialog.open(DeleteModalComponent, {
    //   width: '250px',
    //   data: {
    //     content: `Czy na pewno chcesz usunąć ofertę ${requisition.company.nameShort} - ${requisition.estimatedProfit} zł?`,
    //     ok: true
    //   }
    // });
    //
    // dialogRef
    //   .afterClosed()
    //   .pipe(
    //     switchMap(result => {
    //       if (result) {
    //         return this.requisitionsService.deleteRequisition(requisition.id);
    //       } else {
    //         return EMPTY;
    //       }
    //     })
    //   )
    //   .subscribe({
    //     next: () => {
    //       this.onPageChanged(this.pageUrl.getValue());
    //     }
    //   });
    //
    // dialogRef.afterClosed().subscribe({
    //   next: () => {
    //     this.requisitionsService.deleteRequisition(requisition.id);
    //   }
    // });
  }
}
