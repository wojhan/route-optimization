import { Component, OnInit } from '@angular/core';
import { delay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserService } from '@route-optimizer/core/services/user.service';
import { ProfileStats } from '@route-optimizer/core/models/ProfileStats';

@Component({
  selector: 'app-dashboard-business-trip-stats',
  templateUrl: './dashboard-business-trip-stats.component.html'
})
export class DashboardBusinessTripStatsComponent implements OnInit {
  businessTripStats: BusinessTripStats;

  constructor(private userService: UserService) {}

  ngOnInit() {
    const profileStats = this.userService.getProfileStats().pipe(
      delay(1000),
      tap(() => (this.businessTripStats.loading = false))
    );

    this.businessTripStats = { businessTripStat: profileStats, loading: true };
  }
}

interface BusinessTripStats {
  businessTripStat: Observable<ProfileStats>;
  loading: boolean;
}
