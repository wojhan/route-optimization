import { Company } from './Company';

export class Requisition {
  id: number;
  estimatedProfit: number;
  company: Company;
  assignmentDate: Date;
  createdBy: number;
}
