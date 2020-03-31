import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CompanyService } from '../../../../../core/services/company.service';
import { CompanyHistory } from '../../../../../core/models/CompanyHistory';

@Component({
  selector: 'app-company-details-history',
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit {
  @Input()
  companyId: number;

  history: UserHistory;
  constructor(private companiesService: CompanyService) {}

  ngOnInit() {
    const histories: Observable<CompanyHistory[]> = this.companiesService.getUserHistory(this.companyId).pipe(
      map((history: CompanyHistory[]) =>
        history.map(h => {
          const startDate = new Date(h.businessTrip.startDate);
          console.log(startDate);
          const finishDate = new Date(h.businessTrip.finishDate);
          startDate.setDate(startDate.getDate() + h.day);
          console.log(startDate);

          // finishDate.setDate(finishDate.getDate() + h.day);
          h.businessTrip.finishDateAsDate = finishDate;
          h.businessTrip.startDateAsDate = startDate;
          return h;
        })
      ),
      tap(() => (this.history.loading = false))
    );
    this.history = { records: histories, loading: true };
  }
}

interface UserHistory {
  records: Observable<CompanyHistory[]>;
  loading: boolean;
}
