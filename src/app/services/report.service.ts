import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { Report } from '../model/Report';
import * as moment from 'moment';
import { Company } from '../model/Company';

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
    reportFormData.append('companyType', 'Deprecated'); //TODO à supprimer
    reportFormData.append('anomalyCategory', report.category);
    if (report.subcategory) {
      reportFormData.append('anomalySubcategory', report.subcategory.title);
    }
    reportFormData.append('companyName', report.company.name);
    reportFormData.append('companyAddress', this.getCompanyAddress(report.company));
    reportFormData.append('companyPostalCode', report.company.postalCode);
    reportFormData.append('companySiret', report.company.siret);
    reportFormData.append('anomalyDate', moment(report.details.anomalyDate).format('YYYY-MM-DD'));
    if (report.details.anomalyTimeSlot) {
      reportFormData.append('anomalyTimeSlot', report.details.anomalyTimeSlot.toString());
    }
    if (report.details.ticketFile) {
      reportFormData.append('ticketFile', report.details.ticketFile, report.details.ticketFile.name);
    }
    if (report.details.anomalyFile) {
      reportFormData.append('anomalyFile', report.details.anomalyFile, report.details.anomalyFile.name);
    }
    reportFormData.append('description', report.details.description);
    reportFormData.append('firstName', report.consumer.firstName);
    reportFormData.append('lastName', report.consumer.lastName);
    reportFormData.append('email', report.consumer.email);
    if (report.contactAgreement) {
      reportFormData.append('contactAgreement', report.contactAgreement.toString());
    }

    return reportFormData;
  }


  getCompanyAddress(company: Company) {
    let address = '';
    const addressAttibutes = ['line1', 'line2', 'line3', 'line4', 'line5', 'line6', 'line7'];
    if (company) {
      for (const attribute of addressAttibutes) {
        if (company[attribute]) {
          address = address.concat(`${company[attribute]} - `);
        }
      }
    }
    return address.substring(0, address.length - 3);
  }
}
