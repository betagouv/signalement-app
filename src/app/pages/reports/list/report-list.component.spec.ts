import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { ReportListComponent } from './report-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportDetailComponent } from '../detail/report-detail.component';
import { NgxLoadingModule } from 'ngx-loading';
import { AppRoleDirective } from '../../../directives/app-role/app-role.directive';
import { AppPermissionDirective } from '../../../directives/app-permission/app-permission.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';
import { AuthenticationService } from '../../../services/authentication.service';
import { of } from 'rxjs';
import { Roles } from '../../../model/AuthUser';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { ConstantService } from '../../../services/constant.service';
import { ReportStatus } from '../../../model/Report';
import { ReportService } from '../../../services/report.service';
import { genPaginatedReports, genUser } from '../../../../../test/fixtures.spec';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale, frLocale } from 'ngx-bootstrap/chronos';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReportListModule } from './report-list.module';

describe('ReportListComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;

  let authenticationService: AuthenticationService;
  let companyAccessesService: CompanyAccessesService;
  let constantService: ConstantService;
  let reportService: ReportService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportDetailComponent,
        AppRoleDirective,
        AppPermissionDirective,
      ],
      imports: [
        BrowserAnimationsModule,
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
        BrowserAnimationsModule,
        ComponentsModule,
        ReportListModule,
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    companyAccessesService = TestBed.inject(CompanyAccessesService);

    const adminUser = genUser(Roles.Admin);
    defineLocale('fr', frLocale);
    reportService = TestBed.inject(ReportService);
    constantService = TestBed.inject(ConstantService);
    authenticationService = TestBed.inject(AuthenticationService);
    authenticationService.user = of(adminUser);
    fixture = TestBed.createComponent(ReportListComponent);
    component = fixture.componentInstance;

    spyOn(constantService, 'getReportStatusList').and.returnValue(of([ReportStatus.InProgress]));
  });

  it ('should display report list in a table', () => {
    spyOn(reportService, 'getReports').and.returnValue(of(genPaginatedReports(3)));

    fixture.detectChanges();


    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('app-report-list-search')).not.toBeNull();
    expect(nativeElement.querySelectorAll('.table-container tbody tr').length).toEqual(3);
  });
});
