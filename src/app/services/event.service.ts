import { Injectable } from '@angular/core';
import { Api, ServiceUtils } from './service.utils';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { Event, ReportEvent } from '../model/ReportEvent';
import { AuthenticationService } from './authentication.service';
import { combineLatest } from 'rxjs';
import { User } from '../model/AuthUser';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils,
              private authenticationService: AuthenticationService) { }

  createEvent(event: Event) {
    return combineLatest([
      this.authenticationService.getUser(),
      this.serviceUtils.getAuthHeaders()
    ]).pipe(
      mergeMap(([user, headers]) => {
        return this.http.post<Event>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports', event.reportId, 'events']),
          this.event2eventApi(event, user),
          headers
        );
      }));
  }

  confirmContactByPostOnReportList(reportuuids: Set<string>) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports', 'events', 'contactByPost']),
          { reportIds : Array.from(reportuuids) },
          headers
        );
      })
    );
  }

  getEvents(reportId: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<ReportEvent[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports', reportId, 'events']),
          headers
        );
      })
    );
  }

  getCompanyEvents(siret: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<ReportEvent[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'companies', siret, 'events']),
          headers
        );
      })
    );
  }

  event2eventApi(event: Event, user: User) {
    return {
      reportId: event.reportId,
      userId: user.id,
      eventType: event.eventType,
      action: event.action.value,
      details: event.details
    };
  }
}
