import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-business-trip-stats',
  templateUrl: './business-trip-stats.component.html',
  styleUrls: ['./business-trip-stats.component.scss']
})
export class BusinessTripStatsComponent implements OnInit {
  businessTripStats: BusinessTripStats;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const profileStats = this.http.get<ProfileStats>(`http://localhost:8000/api/my-profile/stats/`).pipe(
      delay(1000),
      tap(() => (this.businessTripStats.loading = false)),
      map((ps: ProfileStats) => {
        ps.totalDistance = Math.round(ps.totalDistance);
        return ps;
      })
    );

    this.businessTripStats = { businessTripStat: profileStats, loading: true };
  }
}

class ProfileStats {
  totalBusinessTrips: number;
  visitedCompanies: number;
  totalDistance: number;
}

interface BusinessTripStats {
  businessTripStat: Observable<ProfileStats>;
  loading: boolean;
}
