import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Website, WebsiteWithCompany } from '../model/Website';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  constructor(
    private http: HttpClient,
    private utils: ServiceUtils,
  ) {
  }

  list(): Observable<WebsiteWithCompany[]> {
    return this.utils.getAuthHeaders().pipe(
      mergeMap(headers => this.http.get<WebsiteWithCompany[]>(this.utils.getUrl(Api.Report, ['api', 'websites']), headers))
    );
  }

  update(id: string, website: Partial<Website>): Observable<WebsiteWithCompany> {
    return this.utils.getAuthHeaders().pipe(
      mergeMap(headers => this.http.put<WebsiteWithCompany>(this.utils.getUrl(Api.Report, ['api', 'websites', id]), website, headers))
    );
  }
}
