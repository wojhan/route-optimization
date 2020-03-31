import { Component, OnInit } from '@angular/core';
// import { DashboardHomeService } from '../../dashboard-home.service';
import { Observable } from 'rxjs';
// import { Requisition } from 'src/app/requistions/requistions.service';
import { delay, map, tap } from 'rxjs/operators';
import { faMoneyBillWave, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Requisition } from '../../../core/models/Requisition';
import { RequisitionService } from '../../../core/services/requisition.service';
import { Page } from '../../../core/models/Page';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-last-requisitions',
  templateUrl: './last-requisitions.component.html'
})
export class LastRequisitionsComponent implements OnInit {
  lastRequisitions: LastRequisitions;
  faMoneyBillWave: IconDefinition = faMoneyBillWave;

  constructor(private requisitionService: RequisitionService, private authenticationService: AuthenticationService) {}

  ngOnInit() {
    const userId = this.authenticationService.currentUser.getValue().id;
    const requisitions = this.requisitionService.list(null, userId, 5).pipe(
      delay(1000),
      map((page: Page<Requisition>) => page.results),
      tap(() => (this.lastRequisitions.loading = false))
    );

    this.lastRequisitions = { requisitions, loading: true };
  }
}

interface LastRequisitions {
  requisitions: Observable<Requisition[]>;
  loading: boolean;
}
