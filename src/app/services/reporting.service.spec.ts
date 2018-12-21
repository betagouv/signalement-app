import { TestBed } from '@angular/core/testing';

import { ReportingService } from './reporting.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceUtils } from './service.utils';
import { Reporting } from '../model/Reporting';
import { environment } from '../../environments/environment';

describe('ReportingService', () => {

  let reportingService: ReportingService;
  let httpMock: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      ReportingService,
      ServiceUtils,
    ]
  }));

  beforeEach(() => {
    reportingService = TestBed.get(ReportingService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: ReportingService = TestBed.get(ReportingService);
    expect(service).toBeTruthy();
  });

  describe('reporting creation', () => {

    it('should post an http request with data to the reporting creation API', (done) => {

      const anomalyDate = new Date(2018, 2, 1);
      const anomalyFile = new File([], 'anomaly.jpg');
      const reporting = new Reporting();
      reporting.companyType = 'companyType';
      reporting.companyName = 'companyName';
      reporting.companyAddress = 'companyAddress';
      reporting.description = 'desc';
      reporting.anomalyDate = anomalyDate;
      reporting.anomalyTimeSlot = 5;
      reporting.lastName = 'lastName';
      reporting.firstName = 'firstName';
      reporting.email = 'email@mail.fr';
      reporting.anomalyFile = anomalyFile;

      reportingService.createReporting(reporting).subscribe(result => {
          done();
        }
      );

      const reportingRequest = httpMock.expectOne(`${environment.apiReportingBaseUrl}/api/reports`);
      reportingRequest.flush({});

      httpMock.verify();
      expect(reportingRequest.request.body.get('companyType')).toBe('companyType');
      expect(reportingRequest.request.body.get('companyName')).toBe('companyName');
      expect(reportingRequest.request.body.get('companyAddress')).toBe('companyAddress');
      expect(reportingRequest.request.body.get('description')).toBe('desc');
      expect(reportingRequest.request.body.get('anomalyDate')).toBe('2018-03-01');
      expect(reportingRequest.request.body.get('anomalyTimeSlot')).toBe('5');
      expect(reportingRequest.request.body.get('lastName')).toBe('lastName');
      expect(reportingRequest.request.body.get('lastName')).toBe('lastName');
      expect(reportingRequest.request.body.get('email')).toBe('email@mail.fr');
      expect(reportingRequest.request.body.get('ticketFile')).toBeNull();
      expect(reportingRequest.request.body.get('anomalyFile').name).toBe(anomalyFile.name);
    });

  });
});
