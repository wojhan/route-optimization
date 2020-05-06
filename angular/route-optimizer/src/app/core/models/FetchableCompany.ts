import { FetchableContent } from './FetchableContent';
import { Company } from './Company';

export interface FetchableCompany extends FetchableContent {
  data: Company[];
}
