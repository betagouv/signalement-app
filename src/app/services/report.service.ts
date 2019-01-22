import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { Report } from '../model/Report';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  createReport(report: Report) {

    return this.http.post(
      this.serviceUtils.getUrl(Api.Report, ['api', 'reports']),
      this.generateReportFormData(report)
    );
  }

  private generateReportFormData(report: Report) {

    const reportFormData: FormData = new FormData();
    reportFormData.append('companyType', report.companyType);
    reportFormData.append('anomalyCategory', report.anomalyCategory);
    reportFormData.append('anomalyPrecision', report.anomalyPrecision);
    reportFormData.append('companyName', report.companyName);
    reportFormData.append('companyAddress', report.companyAddress);
    reportFormData.append('companyPostalCode', report.companyPostalCode);
    reportFormData.append('companySiret', report.companySiret);
    reportFormData.append('anomalyDate', moment(report.details.anomalyDate).format('YYYY-MM-DD'));
    if (report.details.anomalyTimeSlot) {
      reportFormData.append('anomalyTimeSlot', report.details.anomalyTimeSlot.toString());
    }
    reportFormData.append('description', report.details.description);
    reportFormData.append('firstName', report.consumer.firstName);
    reportFormData.append('lastName', report.consumer.lastName);
    reportFormData.append('email', report.consumer.email);
    if (report.contactAgreement) {
      reportFormData.append('contactAgreement', report.contactAgreement.toString());
    }
    if (report.ticketFile) {
      reportFormData.append('ticketFile', report.ticketFile, report.ticketFile.name);
    }
    if (report.anomalyFile) {
      reportFormData.append('anomalyFile', report.anomalyFile, report.anomalyFile.name);
    }

    return reportFormData;
  }


}
