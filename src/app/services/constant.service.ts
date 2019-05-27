import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { mergeMap } from 'rxjs/operators';
import { ReportEventAction } from '../model/ReportEvent';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) { }

  getActionPros() {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<ReportEventAction[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'constants', 'actionPros']),
          headers
        );
      })
    );
  }

  getActionConsos() {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<ReportEventAction[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'constants', 'actionConsos']),
          headers
        );
      })
    );
  }

  getStatusPros() {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<string[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'constants', 'statusPros']),
          headers
        );
      })
    );
  }

  getStatusConsos() {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<string[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'constants', 'statusConsos']),
          headers
        );
      })
    );
  }
}
