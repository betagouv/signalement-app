import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceUtils } from './core/service.utils';
import { DetailInputValue, Step } from '../model/Report';
import { environment } from '../../environments/environment';
import { UploadedFile } from '../model/UploadedFile';
import { Department, Region } from '../model/Region';
import { genDraftReport, genSubcategory } from '../../../test/fixtures.spec';

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
    reportService = TestBed.inject(ReportService);
    serviceUtils = TestBed.inject(ServiceUtils);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: ReportService = TestBed.inject(ReportService);
    expect(service).toBeTruthy();
  });

  describe('report creation', () => {

    it('should post an http request with data to the report creation API', (done) => {

      const anomalyDate = new Date(2018, 2, 1);
      const anomalyFile = Object.assign(new UploadedFile(), {
        id: '856cdf46-a8c2-436d-a34c-bb303ff108a6',
        filename: 'anomaly.jpg'
      });
      const subcategory1 = genSubcategory();
      const subcategory2 = genSubcategory();

      const detailInputValue = new DetailInputValue();
      detailInputValue.label = 'mon label';
      detailInputValue.value = 'ma value';

      const draftReport = genDraftReport(Step.Confirmation);
      draftReport.uploadedFiles = [anomalyFile];
      draftReport.subcategories = [subcategory1, subcategory2];
      draftReport.detailInputValues = [detailInputValue];

      reportService.createReport(draftReport).subscribe(result => {
          done();
        }
      );

      const reportRequest = httpMock.expectOne(`${environment.apiReportBaseUrl}/api/reports`);
      reportRequest.flush({});

      httpMock.verify();
      expect(reportRequest.request.body['category']).toBe(draftReport.category);
      expect(reportRequest.request.body['subcategories']).toEqual([subcategory1.title, subcategory2.title]);
      expect(reportRequest.request.body['tags']).toEqual([...(subcategory1.tags || []), ...(subcategory2.tags || [])]);
      expect(reportRequest.request.body['companyName']).toBe(draftReport.draftCompany.name);
      expect(reportRequest.request.body['companyAddress']).toBe(draftReport.draftCompany.address);
      expect(reportRequest.request.body['firstName']).toBe(draftReport.consumer.firstName);
      expect(reportRequest.request.body['lastName']).toBe(draftReport.consumer.lastName);
      expect(reportRequest.request.body['email']).toBe(draftReport.consumer.email);
      expect(reportRequest.request.body['details']).toEqual([{label: 'mon label :', value: 'ma value'}]);
    });

  });
});
