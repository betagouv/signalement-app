import { Injectable } from '@angular/core';
import { Api, ServiceUtils } from './service.utils';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { ReportEvent } from '../model/ReportEvent';
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

  createEvent(event: ReportEvent) {
    return combineLatest(
      this.authenticationService.user,
      this.serviceUtils.getAuthHeaders()
    ).pipe(
      mergeMap(([user, headers]) => {
        return this.http.post<ReportEvent>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports', event.reportId, 'events']),
          this.event2eventApi(event, user),
          headers
        );
      }));
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

  event2eventApi(event: ReportEvent, user: User) {
    return {
      reportId: event.reportId,
      userId: user.id,
      eventType: event.eventType,
      action: event.action.name,
      resultAction: event.resultAction,
      detail: event.detail
    };
  }
}
