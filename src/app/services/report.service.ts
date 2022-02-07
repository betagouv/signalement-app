import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './core/service.utils';
import { DetailInputValue, DraftReport, Report } from '../model/Report';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  constructor(private http: HttpClient,
    private serviceUtils: ServiceUtils) {
  }

  createReport(draftReport: DraftReport) {
    return this.http.post<Report>(
      this.serviceUtils.getUrl(Api.Report, ['api', 'reports']),
      {
        category: draftReport.category,
        subcategories: !draftReport.subcategories ? [] : draftReport.subcategories
          .map(subcategory => subcategory.title ? subcategory.title : subcategory),
        tags: draftReport.tags,
        reponseconsoCode: draftReport.reponseconsoCode,
        ccrfCode: draftReport.ccrfCode,
        firstName: draftReport.consumer.firstName,
        lastName: draftReport.consumer.lastName,
        email: draftReport.consumer.email,
        consumerPhone: draftReport.consumer.phone,
        contactAgreement: draftReport.contactAgreement,
        employeeConsumer: draftReport.employeeConsumer,
        fileIds: draftReport.uploadedFiles.map(file => file.id),
        details: draftReport.detailInputValues
          .map(d => Object.assign(new DetailInputValue(), d))
          .map(detailInputValue => {
            return {
              label: detailInputValue.renderedLabel,
              value: detailInputValue.renderedValue,
            };
          }),
        forwardToReponseConso: draftReport.forwardToReponseConso,
        companyName: draftReport.draftCompany.name,
        companyAddress: draftReport.draftCompany.address,
        companySiret: draftReport.draftCompany.siret,
        companyActivityCode: draftReport.draftCompany.activityCode,
        websiteURL: draftReport.draftCompany.website ? draftReport.draftCompany.website.url : undefined,
        phone: draftReport.draftCompany.phone,
        vendor: draftReport.vendor
      },
    );
  }
}

