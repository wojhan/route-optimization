import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { DashboardHomeService } from '../../dashboard-home.service';
import { Observable } from 'rxjs';
import { Requistion } from 'src/app/requistions/requistions.service';
import { delay, tap } from 'rxjs/operators';
import { IconDefinition, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-last-requisitions',
  templateUrl: './last-requisitions.component.html',
  styleUrls: ['./last-requisitions.component.scss']
})
export class LastRequisitionsComponent implements OnInit {
  lastRequisitions: LastRequisitions;
  faMoneyBillWave: IconDefinition = faMoneyBillWave;

  constructor(private dashboardHomeService: DashboardHomeService) {}

  ngOnInit() {
    const requisitions = this.dashboardHomeService.getLastRequisitions(5).pipe(
      delay(1000),
      tap(() => {
        this.lastRequisitions.loading = false;
        console.log(this.lastRequisitions);
      })
    );
    this.lastRequisitions = { requisitions, loading: true };
    // this.lastRequisitions.loading = true;
    // this.lastRequisitions.requisitions = this.dashboardHomeService.getLastRequisitions(5);
  }
}

interface LastRequisitions {
  requisitions: Observable<Requistion[]>;
  loading: boolean;
}
