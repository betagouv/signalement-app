import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceUtils } from './service.utils';
import { DetailInputValue, Report } from '../model/Report';
import { environment } from '../../environments/environment';
import { Consumer } from '../model/Consumer';
import { Company } from '../model/Company';
import { Subcategory } from '../model/Anomaly';
import { UploadedFile } from '../model/UploadedFile';

describe('ReportService', () => {

  let reportService: ReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ],
    providers: [
      ReportService,
      ServiceUtils,
    ]
  }));

  beforeEach(() => {
    reportService = TestBed.get(ReportService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: ReportService = TestBed.get(ReportService);
    expect(service).toBeTruthy();
  });

  describe('report creation', () => {

    it('should post an http request with data to the report creation API', (done) => {

      const anomalyDate = new Date(2018, 2, 1);
      const anomalyFile = Object.assign(new UploadedFile(), {
        id: '856cdf46-a8c2-436d-a34c-bb303ff108a6',
        filename: 'anomaly.jpg'
      });
      const subcategory1 = new Subcategory();
      subcategory1.title = 'sous catégorie 1';
      const subcategory2 = new Subcategory();
      subcategory2.title = 'sous catégorie 2';
      const consumer = new Consumer();
      consumer.lastName = 'lastName';
      consumer.firstName = 'firstName';
      consumer.email = 'email@mail.fr';
      const company = new Company();
      company.name = 'companyName';
      company.line1 = 'line 1';
      company.line2 = 'line 2';
      company.line4 = 'line 4';
      const detailInputValue = new DetailInputValue();
      detailInputValue.label = 'mon label';
      detailInputValue.value = 'ma value';
      const report = new Report();
      report.uploadedFiles = [anomalyFile];
      report.category = 'category';
      report.subcategories = [subcategory1, subcategory2];
      report.consumer = consumer;
      report.company = company;
      report.detailInputValues = [detailInputValue];

      reportService.createReport(report).subscribe(result => {
          done();
        }
      );

      const reportRequest = httpMock.expectOne(`${environment.apiReportBaseUrl}/api/reports`);
      reportRequest.flush({});

      httpMock.verify();
      expect(reportRequest.request.body['category']).toBe('category');
      expect(reportRequest.request.body['subcategories']).toEqual([subcategory1.title, subcategory2.title]);
      expect(reportRequest.request.body['companyName']).toBe('companyName');
      expect(reportRequest.request.body['companyAddress']).toBe('line 1 - line 2 - line 4');
      expect(reportRequest.request.body['lastName']).toBe('lastName');
      expect(reportRequest.request.body['lastName']).toBe('lastName');
      expect(reportRequest.request.body['email']).toBe('email@mail.fr');
      expect(reportRequest.request.body['fileIds']).toEqual([anomalyFile.id]);
      expect(reportRequest.request.body['details']).toEqual([{label: 'mon label :', value: 'ma value'}]);
    });

  });
});
