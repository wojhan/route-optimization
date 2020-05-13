import * as L from 'leaflet';
import 'leaflet-routing-machine';

import { RouteType } from '@route-optimizer/core/enums/RouteType';

export interface WayPoint extends L.Routing.Waypoint {
  routeType: RouteType;
}
