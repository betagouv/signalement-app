import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceUtils } from './service.utils';
import { DetailInputValue, DraftReport } from '../model/Report';
import { environment } from '../../environments/environment';
import { Consumer } from '../model/Consumer';
import { CompanySearchResult } from '../model/CompanySearchResult';
import { Subcategory } from '../model/Anomaly';
import { UploadedFile } from '../model/UploadedFile';
import { ReportFilter } from '../model/ReportFilter';
import { of } from 'rxjs';
import { Department, Region } from '../model/Region';

describe('ReportService', () => {

  let reportService: ReportService;
  let serviceUtils: ServiceUtils;
  let httpMock: HttpTestingController;

  const regionFixture = new Region();
  regionFixture.label = 'labelRegion';
  const dept1Fixture = new Department();
  dept1Fixture.code = 'codeDept1';
  dept1Fixture.label = 'labelDept1';
  const dept2Fixture = new Department();
  dept2Fixture.code = 'codeDept2';
  dept2Fixture.label = 'labelDept2';
  regionFixture.departments = [dept1Fixture, dept2Fixture];

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
    serviceUtils = TestBed.get(ServiceUtils);
    httpMock = TestBed.get(HttpTestingController);
  });

  beforeEach(() => {
    spyOn(serviceUtils, 'getAuthHeaders').and.returnValue(of({
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Auth-Token': 'lklklkjlkjlkj'
      }
    }));
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
      const company = new CompanySearchResult();
      company.name = 'companyName';
      company.line1 = 'line 1';
      company.line2 = 'line 2';
      company.line4 = 'line 4';
      const detailInputValue = new DetailInputValue();
      detailInputValue.label = 'mon label';
      detailInputValue.value = 'ma value';
      const draftReport = new DraftReport();
      draftReport.uploadedFiles = [anomalyFile];
      draftReport.category = 'category';
      draftReport.subcategories = [subcategory1, subcategory2];
      draftReport.consumer = consumer;
      draftReport.companyData = company;
      draftReport.detailInputValues = [detailInputValue];

      reportService.createReport(draftReport).subscribe(result => {
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
      expect(reportRequest.request.body['details']).toEqual([{label: 'mon label :', value: 'ma value'}]);
    });

  });
  describe('get reports', () => {

    it('should not pass a departments http param when there are no area report filter', (done) => {

      const reportFilter = new ReportFilter();
      reportFilter.period = [new Date(), new Date()];
      const offset = 0;
      const limit = 10;

      reportService.getReports(offset, limit, reportFilter).subscribe(result => {
          done();
        }
      );

      const getReportRequest = httpMock.expectOne(req => req.url === `${environment.apiReportBaseUrl}/api/reports`);
      getReportRequest.flush({
        totalCount: 0,
        hasNextPage: false,
        entities: []
      });

      expect(getReportRequest.request.params.get('offset')).toEqual(offset.toString());
      expect(getReportRequest.request.params.get('limit')).toEqual(limit.toString());
      expect(getReportRequest.request.params.get('departments')).toBeNull();

      httpMock.verify();
    });

    it('should pass a list of departments as departments http param when report filter contains a region area', (done) => {

      const reportFilter = new ReportFilter();
      reportFilter.departments = regionFixture.departments;
      reportFilter.period = [new Date(), new Date()];
      const offset = 0;
      const limit = 10;

      reportService.getReports(offset, limit, reportFilter).subscribe(result => {
          done();
        }
      );

      const getReportRequest = httpMock.expectOne(req => req.url === `${environment.apiReportBaseUrl}/api/reports`);
      getReportRequest.flush({
        totalCount: 0,
        hasNextPage: false,
        entities: []
      });

      expect(getReportRequest.request.params.get('offset')).toEqual(offset.toString());
      expect(getReportRequest.request.params.get('limit')).toEqual(limit.toString());
      expect(getReportRequest.request.params.get('departments')).toEqual(`${dept1Fixture.code},${dept2Fixture.code}`);

      httpMock.verify();
    });

    it('should pass a list of departments as departments http param when report filter contains a region area', (done) => {

      const reportFilter = new ReportFilter();
      reportFilter.departments = [dept2Fixture];
      reportFilter.period = [new Date(), new Date()];
      const offset = 0;
      const limit = 10;

      reportService.getReports(offset, limit, reportFilter).subscribe(result => {
          done();
        }
      );

      const getReportRequest = httpMock.expectOne(req => req.url === `${environment.apiReportBaseUrl}/api/reports`);
      getReportRequest.flush({
        totalCount: 0,
        hasNextPage: false,
        entities: []
      });

      expect(getReportRequest.request.params.get('offset')).toEqual(offset.toString());
      expect(getReportRequest.request.params.get('limit')).toEqual(limit.toString());
      expect(getReportRequest.request.params.get('departments')).toEqual(`${dept2Fixture.code}`);

      httpMock.verify();
    });
  });
});
