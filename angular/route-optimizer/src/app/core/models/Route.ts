import { Company } from './Company';
import { RouteType } from '@route-optimizer/core/enums/RouteType';

export class Route {
  startPoint: Company;
  endPoint: Company;
  segmentOrder: number;
  day: number;
  distance: number;
  routeType: RouteType;
}
