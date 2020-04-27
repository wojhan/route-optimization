import { Employee } from './Employee';
import { Route } from './Route';
import { Requisition } from './Requisition';

export class BusinessTrip {
  id: number;
  startDate: string;
  startDateAsDate: Date;
  finishDate: string;
  finishDateAsDate: Date;
  duration: number;
  distance: number;
  assignee: Employee;
  estimatedProfit: number;
  routes: Route[];
  requistions: Requisition[];
  maxDistance: number;
  isProcessed: boolean;
}
