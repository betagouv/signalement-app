import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceUtils } from './service.utils';
import { Report, ReportDetails } from '../model/Report';
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

  describe('get precision from report details', () => {

    it('should return the precision title for a single precision different from "Autre"', () => {
      const reportDetails = new ReportDetails();
      reportDetails.precision = 'précision';

      const precision = reportService.getDetailsPrecision(reportDetails);

      expect(precision).toEqual('précision');
    });

    it('should return the precision title for a single precision "Autre" with and other precision', () => {
      const reportDetails = new ReportDetails();
      reportDetails.precision = 'Autre';
      reportDetails.otherPrecision = 'autre précision';

      const precision = reportService.getDetailsPrecision(reportDetails);

      expect(precision).toEqual('Autre (autre précision)');
    });


    it('should return the list of precisions title for a multiple precisions all differents from "Autre"', () => {
      const reportDetails = new ReportDetails();
      reportDetails.precision = ['précision1', 'précision2'];

      const precision = reportService.getDetailsPrecision(reportDetails);

      expect(precision).toEqual('précision1, précision2');
    });

  });

  describe('report creation', () => {

    it('should post an http request with data to the report creation API', (done) => {

      const anomalyDate = new Date(2018, 2, 1);
      const anomalyFile = Object.assign(new UploadedFile(), {
        id: '856cdf46-a8c2-436d-a34c-bb303ff108a6',
        filename: 'anomaly.jpg'
      });
      const subcategory = new Subcategory();
      subcategory.title = 'sous catégorie';
      const reportDetails = new ReportDetails();
      reportDetails.precision = 'precision';
      reportDetails.description = 'desc';
      reportDetails.anomalyDate = anomalyDate;
      reportDetails.anomalyTimeSlot = 5;
      reportDetails.uploadedFiles = [anomalyFile];
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
      report.category = 'category';
      report.subcategories = [subcategory];
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
      expect(reportRequest.request.body['category']).toBe('category');
      expect(reportRequest.request.body['subcategory']).toBe('sous catégorie');
      expect(reportRequest.request.body['precision']).toBe('precision');
      expect(reportRequest.request.body['companyName']).toBe('companyName');
      expect(reportRequest.request.body['companyAddress']).toBe('line 1 - line 2 - line 4');
      expect(reportRequest.request.body['description']).toBe('desc');
      expect(reportRequest.request.body['anomalyDate']).toBe('2018-03-01');
      expect(reportRequest.request.body['anomalyTimeSlot']).toBe(5);
      expect(reportRequest.request.body['lastName']).toBe('lastName');
      expect(reportRequest.request.body['lastName']).toBe('lastName');
      expect(reportRequest.request.body['email']).toBe('email@mail.fr');
      expect(reportRequest.request.body['fileIds']).toEqual([anomalyFile.id]);
    });

  });
});
