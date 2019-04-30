import { Injectable } from '@angular/core';
import { Api, ServiceUtils } from './service.utils';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { ReportEvent } from '../model/ReportEvent';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) { }

  createEvent(event: ReportEvent) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'events']),
          event,
          headers
        );
      }));
  }

  getEvents(reportId: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<ReportEvent[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'events', reportId]),
          headers
        );
      })
    );
  }
}
