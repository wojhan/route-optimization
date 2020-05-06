import { FetchableContent } from '@route-optimizer/core/models/FetchableContent';

export interface FetchableContentList<T> extends FetchableContent {
  data: T[];
}
