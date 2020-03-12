import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsDatepickerModule, BsDropdownModule, defineLocale, frLocale, ModalModule, PaginationModule, TooltipModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ReportListComponent } from './report-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportDetailComponent } from '../detail/report-detail.component';
import { NgxLoadingModule } from 'ngx-loading';
import { AppRoleDirective } from '../../../../directives/app-role.directive';
import { AppPermissionDirective } from '../../../../directives/app-permission.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { PipesModule } from '../../../../pipes/pipes.module';
import { ComponentsModule } from '../../../../components/components.module';
import { AuthenticationService } from '../../../../services/authentication.service';
import { of } from 'rxjs';
import { Roles } from '../../../../model/AuthUser';
import { CompanyAccessesService } from '../../../../services/companyaccesses.service';
import { ConstantService } from '../../../../services/constant.service';
import { Report, ReportStatus } from '../../../../model/Report';
import { ReportService } from '../../../../services/report.service';
import { PaginatedData } from '../../../../model/PaginatedData';
import { genReport, genUser, genUserAccess } from '../../../../../../test/fixtures.spec';

describe('ReportListComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;

  let authenticationService: AuthenticationService;
  let companyAccessesService: CompanyAccessesService;
  let constantService: ConstantService;
  let reportService: ReportService;

  const reportPaginatedDataFixture = Object.assign(new PaginatedData<Report>(), {
    totalCount: 3,
    hasNextPage: false,
    entities: [genReport(), genReport(), genReport()]
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportListComponent,
        ReportDetailComponent,
        AppRoleDirective,
        AppPermissionDirective,
      ],
      imports: [
        PaginationModule.forRoot(),
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        HttpClientModule,
        NgxLoadingModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        PipesModule,
        ComponentsModule
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    companyAccessesService = TestBed.get(CompanyAccessesService);
  });

  describe('for a professional user', () => {

    const proUser = genUser(Roles.Pro);

    beforeEach(() => {
      defineLocale('fr', frLocale);
      reportService = TestBed.get(ReportService);
      constantService = TestBed.get(ConstantService);
      authenticationService = TestBed.get(AuthenticationService);
      authenticationService.user = of(proUser);
      fixture = TestBed.createComponent(ReportListComponent);
      component = fixture.componentInstance;

      spyOn(constantService, 'getReportStatusList').and.returnValue(of([ReportStatus.ToProcess]));
    });

    it('should load user accesses on init', () => {
      const myAccessesSpy = spyOn(companyAccessesService, 'myAccesses');

      fixture.detectChanges();

      expect(myAccessesSpy).toHaveBeenCalledWith(proUser);
    });

    it ('should display a specific message when pro has no accessess and should not load reports', () => {
      spyOn(companyAccessesService, 'myAccesses').and.returnValue(of([]));
      const getReportsSpy = spyOn(reportService, 'getReports');

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('h2').innerText).toEqual('Vous n\'avez accès à aucune entreprise');
      expect(nativeElement.querySelector('form')).toBeNull();
      expect(getReportsSpy).not.toHaveBeenCalled();
    });

    it ('should display report list when pro has only one access', () => {
      spyOn(companyAccessesService, 'myAccesses').and.returnValue(of([genUserAccess()]));
      spyOn(reportService, 'getReports').and.returnValue(of(reportPaginatedDataFixture));

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form')).not.toBeNull();
      expect(nativeElement.querySelectorAll('div.row.item.pointer').length).toEqual(3);
    });

    it ('should display company list when pro has several accesses and should not load reports yet', () => {
      spyOn(companyAccessesService, 'myAccesses').and.returnValue(of([genUserAccess(), genUserAccess()]));
      const getReportsSpy = spyOn(reportService, 'getReports').and.returnValue(of(reportPaginatedDataFixture));

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('h2').innerText).toEqual('Veuillez sélectionner une entreprise');
      expect(nativeElement.querySelector('form')).toBeNull();
      expect(nativeElement.querySelectorAll('div.row.item.pointer').length).toEqual(2);
      expect(getReportsSpy).not.toHaveBeenCalled();
    });

  });

  describe('for an admin user', () => {

    const adminUser = genUser(Roles.Admin);

    beforeEach(() => {
      defineLocale('fr', frLocale);
      reportService = TestBed.get(ReportService);
      constantService = TestBed.get(ConstantService);
      authenticationService = TestBed.get(AuthenticationService);
      authenticationService.user = of(adminUser);
      fixture = TestBed.createComponent(ReportListComponent);
      component = fixture.componentInstance;

      spyOn(constantService, 'getReportStatusList').and.returnValue(of([ReportStatus.ToProcess]));
    });

    it ('should display report list in a table', () => {
      spyOn(reportService, 'getReports').and.returnValue(of(reportPaginatedDataFixture));

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form')).not.toBeNull();
      expect(nativeElement.querySelectorAll('tr.pointer').length).toEqual(3);
    });

  });
});
