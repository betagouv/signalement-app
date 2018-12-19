import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { Reporting } from '../model/Reporting';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  createReporting(reporting: Reporting) {

    return this.http.post(
      this.serviceUtils.getUrl(Api.Reporting, ['api', 'reports']),
      this.generateReportingFormData(reporting)
    );
  }

  private generateReportingFormData(reporting: Reporting) {

    const reportingFormData: FormData = new FormData();
    Object.keys(reporting)
      .forEach(key => {
        const data = reporting[key];
        if (data instanceof Date) {
          reportingFormData.append(key, moment(data).format('YYYY-MM-DD'));
        } else if (data instanceof File) {
          reportingFormData.append(key, data, data.name);
        } else {
          reportingFormData.append(key, data);
        }
      });

    return reportingFormData;
  }


}
