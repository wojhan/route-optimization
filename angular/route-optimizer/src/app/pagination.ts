import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export class Page<T> {
  count: number;
  next: string;
  previous: string;
  results: Array<T>;
}

export function queryPaginated<T>(http: HttpClient, baseUrl: string, pageSize: number, urlOrFilter?: string | object): Observable<Page<T>> {
  let params = new HttpParams();
  let url = `${baseUrl}?page_size=${pageSize}`;

  if (typeof urlOrFilter === 'string') {
    url = urlOrFilter;
  } else if (typeof urlOrFilter === 'object') {
    Object.keys(urlOrFilter)
      .sort()
      .forEach(key => {
        const value = urlOrFilter[key];
        if (value !== null) {
          params = params.set(key, value.toString());
        }
      });
  }

  return http.get<Page<T>>(url, {
    params
  });
}
