import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceUtils } from './service.utils';
import { Report, ReportDetails } from '../model/Report';
import { environment } from '../../environments/environment';
import { Consumer } from '../model/Consumer';
import { Company } from '../model/Company';
import { Subcategory } from '../model/Anomaly';

describe('ReportService', () => {

  let reportService: ReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
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
      const anomalyFile = new File([], 'anomaly.jpg');
      const subcategory = new Subcategory();
      subcategory.title = 'sous catégorie';
      const reportDetails = new ReportDetails();
      reportDetails.description = 'desc';
      reportDetails.anomalyDate = anomalyDate;
      reportDetails.anomalyTimeSlot = 5;
      reportDetails.anomalyFile = anomalyFile;
      const consumer = new Consumer();
      consumer.lastName = 'lastName';
      consumer.firstName = 'firstName';
      consumer.email = 'email@mail.fr';
      const company = new Company();
      company.name = 'companyName';
      company.line1 = 'line 1';
      company.line2 = 'line 2';
      company.line4 = 'line 4';
      const report = new Report();
      report.subcategory = subcategory;
      report.details = reportDetails;
      report.consumer = consumer;
      report.company = company;

      reportService.createReport(report).subscribe(result => {
          done();
        }
      );

      const reportRequest = httpMock.expectOne(`${environment.apiReportBaseUrl}/api/reports`);
      reportRequest.flush({});

      httpMock.verify();
      expect(reportRequest.request.body.get('companyType')).toBe('Deprecated');
      expect(reportRequest.request.body.get('anomalySubcategory')).toBe('sous catégorie');
      expect(reportRequest.request.body.get('companyName')).toBe('companyName');
      expect(reportRequest.request.body.get('companyAddress')).toBe('line 1 - line 2 - line 4');
      expect(reportRequest.request.body.get('description')).toBe('desc');
      expect(reportRequest.request.body.get('anomalyDate')).toBe('2018-03-01');
      expect(reportRequest.request.body.get('anomalyTimeSlot')).toBe('5');
      expect(reportRequest.request.body.get('lastName')).toBe('lastName');
      expect(reportRequest.request.body.get('lastName')).toBe('lastName');
      expect(reportRequest.request.body.get('email')).toBe('email@mail.fr');
      expect(reportRequest.request.body.get('ticketFile')).toBeNull();
      expect(reportRequest.request.body.get('anomalyFile').name).toBe(anomalyFile.name);
    });

  });
});
