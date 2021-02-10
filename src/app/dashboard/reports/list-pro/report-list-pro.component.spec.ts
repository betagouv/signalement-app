import { async, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportDetailComponent } from '../detail/report-detail.component';
import { NgxLoadingModule } from 'ngx-loading';
import { AppRoleDirective } from '../../../directives/app-role/app-role.directive';
import { AppPermissionDirective } from '../../../directives/app-permission/app-permission.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';
import { of } from 'rxjs';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { ConstantService } from '../../../services/constant.service';
import { ReportStatus } from '../../../model/Report';
import { ReportService } from '../../../services/report.service';
import { genPaginatedReports, genUserAccess } from '../../../../../test/fixtures.spec';
import { ReportListProComponent } from './report-list-pro.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale, frLocale } from 'ngx-bootstrap/chronos';
import { SharedModule } from '../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiSdkService } from '../../../services/core/api-sdk.service';
import { ApiSdkMockService } from '../../../services/core/api-sdk-mock.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('ReportListProComponent', () => {
  let companyAccessesService: CompanyAccessesService;
  let constantService: ConstantService;
  let reportService: ReportService;
  let apiSdk: ApiSdkMockService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportListProComponent,
        ReportDetailComponent,
        AppRoleDirective,
        AppPermissionDirective,
      ],
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        PaginationModule.forRoot(),
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        HttpClientTestingModule,
        NgxLoadingModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        PipesModule,
        ComponentsModule,
      ],
      providers: [
        { provide: ApiSdkService, useClass: ApiSdkMockService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    defineLocale('fr', frLocale);
    reportService = TestBed.inject(ReportService);
    companyAccessesService = TestBed.inject(CompanyAccessesService);
    constantService = TestBed.inject(ConstantService);
    apiSdk = TestBed.inject(ApiSdkService) as any;
    activatedRoute = TestBed.inject(ActivatedRoute);

    spyOn(constantService, 'getReportStatusList').and.callFake(() =>
      of([ReportStatus.UnreadForPro, ReportStatus.ClosedForPro, ReportStatus.ToReviewedByPro])
    );
  });

  it('should load user accesses on init', () => {
    const myAccessesSpy = spyOn(companyAccessesService, 'myAccesses').and.returnValue(of([]));
    const fixture = TestBed.createComponent(ReportListProComponent);
    fixture.detectChanges();
    expect(myAccessesSpy).toHaveBeenCalledWith();
  });

  it('should not hide some reports when filters are not displayed', () => {
    const fixture = TestBed.createComponent(ReportListProComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.maxReportsBeforeShowFilters).toBeLessThanOrEqual(component.maxReportsBeforeShowFilters);
    expect(component.maxReportsBeforeShowFilters).toBeLessThanOrEqual(Math.min(...component.pagesOptions));
  });

  it ('should display a specific message when pro has no accessess and should not load reports', () => {
    spyOn(companyAccessesService, 'myAccesses').and.returnValue(of([]));
    const getReportsSpy = spyOn(reportService, 'getReports');

    const fixture = TestBed.createComponent(ReportListProComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('app-fender .-title').innerText).toEqual('Vous n\'avez accès à aucune entreprise');
    expect(nativeElement.querySelector('.-filters')).toBeNull();
    expect(getReportsSpy).not.toHaveBeenCalled();
  });

  it('should display reports list without filters and information when pro has only one access and less than 10 reports', (() => {
    spyOn(companyAccessesService, 'myAccesses').and.returnValue(of([genUserAccess()]));
    spyOn(reportService, 'getReports').and.returnValue(of(genPaginatedReports(3)));
    const fixture = TestBed.createComponent(ReportListProComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelectorAll('tr.tr.hoverable').length).toEqual(3);
    expect(nativeElement.querySelector('[formcontrolname=siret]')).toBeNull();
    expect(nativeElement.querySelector('.mat-column-postalCode')).toBeNull();
    expect(nativeElement.querySelector('.mat-column-siret')).toBeNull();
  }));

  it ('should display report list with filters when pro has only one access and more than 10 reports', () => {
    spyOn(companyAccessesService, 'myAccesses').and.returnValue(of([genUserAccess()]));
    spyOn(reportService, 'getReports').and.returnValue(of(genPaginatedReports(11)));
    const fixture = TestBed.createComponent(ReportListProComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('[formcontrolname=start]')).not.toBeNull();
    expect(nativeElement.querySelector('[formcontrolname=status]')).not.toBeNull();
    expect(nativeElement.querySelectorAll('tr.tr.hoverable').length).toEqual(11);
  });

  it('should display siret form when pro has several accesses', () => {
    spyOn(companyAccessesService, 'myAccesses').and.returnValue(of([genUserAccess(), genUserAccess()]));
    spyOn(reportService, 'getReports').and.returnValue(of(genPaginatedReports(3)));
    const fixture = TestBed.createComponent(ReportListProComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('[formcontrolname=start]')).toBeNull();
    expect(nativeElement.querySelector('[formcontrolname=siret]')).not.toBeNull();
    expect(nativeElement.querySelectorAll('tr.tr.hoverable').length).toEqual(3);
    expect(nativeElement.querySelector('.mat-column-postalCode')).not.toBeNull();
    expect(nativeElement.querySelector('.mat-column-siret')).not.toBeNull();
  });

  it('should display siret and filters form when pro has several accesses and more than 11 companies', () => {
    spyOn(companyAccessesService, 'myAccesses').and.returnValue(of([genUserAccess(), genUserAccess()]));
    spyOn(reportService, 'getReports').and.returnValue(of(genPaginatedReports(22)));
    const fixture = TestBed.createComponent(ReportListProComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('[formcontrolname=start]')).not.toBeNull();
    expect(nativeElement.querySelector('[formcontrolname=siret]')).not.toBeNull();
    expect(nativeElement.querySelectorAll('tr.tr.hoverable').length).toEqual(22);
  });

  it('should paginate correctly', () => {
    spyOn(companyAccessesService, 'myAccesses').and.returnValue(of([genUserAccess(), genUserAccess()]));
    const getReportsSpy = spyOn(reportService, 'getReports').and.returnValue(of(genPaginatedReports(22)));

    const fixture = TestBed.createComponent(ReportListProComponent);
    fixture.detectChanges();

    const calledReport = getReportsSpy.calls.first().args[0];
    expect(calledReport.limit).toEqual(10);
    expect(calledReport.offset).toEqual(0);
  });

  it('should correctly parse the querystring', () => {
    spyOn(companyAccessesService, 'myAccesses').and.returnValue(of([genUserAccess(), genUserAccess()]));
    const getReportsSpy = spyOn(reportService, 'getReports').and.returnValue(of(genPaginatedReports(22)));
    activatedRoute.snapshot.queryParams = {
      offset: 10,
      limit: 20,
      siret: '95450974103825',
      status: 'À répondre',
      start: '2021-02-01',
      end: '2021-02-24',
    };

    const fixture = TestBed.createComponent(ReportListProComponent);
    fixture.detectChanges();

    const calledReport = getReportsSpy.calls.first().args[0];
    expect(calledReport.status).toEqual('À répondre');
    expect(calledReport.start.getTime()).toEqual(new Date(2021, 1, 1).getTime());
    expect(calledReport.end.getTime()).toEqual(new Date(2021, 1, 24).getTime());
    expect(calledReport.siret).toEqual('95450974103825');
    expect(calledReport.limit).toEqual(20);
    expect(calledReport.offset).toEqual(10);
  });
});
