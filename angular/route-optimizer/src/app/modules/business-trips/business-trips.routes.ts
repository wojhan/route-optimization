import { Route } from '@angular/router';
import { BaseLayoutComponent } from '@route-optimizer/modules/base-layout/base-layout.component';
import { MyBusinessTripsPage } from '@route-optimizer/modules/business-trips/pages/my-business-trips/my-business-trips.page';
import { BusinessTripsPage } from '@route-optimizer/modules/business-trips/pages/business-trips.page';
import { UserResolve } from '@route-optimizer/core/UserResolve';
import { BusinessTripDetailPage } from '@route-optimizer/modules/business-trips/pages/business-trip-detail/business-trip-detail.page';
import { BusinessTripsResolver } from '@route-optimizer/modules/business-trips/business-trips.resolver';

export const BusinessTripsRoutes: Route[] = [
  {
    path: '',
    component: BusinessTripsPage,
    data: {
      breadcrumb: 'Delegacje'
    },
    resolve: { user: UserResolve },
    children: [
      {
        path: 'my-business-trips',
        component: MyBusinessTripsPage,
        data: {
          breadcrumb: 'Moje delegacje'
        }
      },
      {
        path: ':id',
        component: BusinessTripDetailPage,
        data: {
          breadcrumb: 'Szczegóły'
        },
        resolve: { businessTrip: BusinessTripsResolver }
      }
    ]
  }
];
