import { Component, OnInit } from '@angular/core';
import { delay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { ProfileStats } from '../../../core/models/ProfileStats';

@Component({
  selector: 'app-business-trip-stats',
  templateUrl: './business-trip-stats.component.html'
})
export class BusinessTripStatsComponent implements OnInit {
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
