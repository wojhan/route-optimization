import { Component, OnInit, Input } from '@angular/core';
import { Company, CompanyHistory, CompaniesService } from 'src/app/companies/companies.service';
import { Requistion } from 'src/app/requistions/requistions.service';
import { BusinessTrip } from 'src/app/business-trips/business-trips.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-company-details-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @Input()
  companyId: number;

  history: UserHistory;
  constructor(private companiesService: CompaniesService) {}

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
