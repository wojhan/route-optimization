import { ModelErrorResponse } from './ModelErrorResponse';

export interface CompanyModelErrorResponse extends ModelErrorResponse {
  nip?: string[];
}
