import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { finalize, map } from 'rxjs/operators';

import { CompanyHistory } from '@route-optimizer/core/models/CompanyHistory';
import { FetchableContentList } from '@route-optimizer/core/models/FetchableContentList';
import { CompanyService } from '@route-optimizer/core/services/company.service';

@Component({
  selector: 'app-company-details-history',
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit, OnDestroy {
  @Input()
  companyId: number;

  history: FetchableContentList<CompanyHistory>;

  constructor(private companyService: CompanyService) {}

  ngOnInit() {
    this.history = { data: null, loading: true };

    this.fetchHistory();
  }

  ngOnDestroy() {}

  private fetchHistory(): void {
    this.companyService
      .getUserHistory(this.companyId)
      .pipe(
        map((history: CompanyHistory[]) => {
          return history.map(h => {
            const startDate = new Date(h.businessTrip.startDate);
            const finishDate = new Date(h.businessTrip.finishDate);
            startDate.setDate(startDate.getDate() + h.day);
            finishDate.setDate(finishDate.getDate() + h.day);

            h.businessTrip.startDateAsDate = startDate;
            h.businessTrip.finishDateAsDate = finishDate;
            return h;
          });
        }),
        finalize(() => (this.history.loading = false)),
        untilComponentDestroyed(this)
      )
      .subscribe(histories => {
        this.history.data = histories;
      });
  }
}
