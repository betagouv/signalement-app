import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationComponent } from './information.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Anomaly } from '../../../model/Anomaly';
import { AnomalyService } from '../../../services/anomaly.service';
import { Step } from '../../../model/Report';
import { RetractationComponent } from '../../static/retractation/retractation.component';
import { ReportStorageService } from '../../../services/report-storage.service';
import { NgxLoadingModule } from 'ngx-loading';
import { genDraftReport } from '../../../../../test/fixtures.spec';
import { of } from 'rxjs';
import { AnalyticsService } from '../../../services/analytics.service';
import { MockAnalyticsService } from '../../../../../test/mocks';

describe('InformationComponent', () => {

  let component: InformationComponent;
  let fixture: ComponentFixture<InformationComponent>;
  let reportStorageService: ReportStorageService;
  let anomalyService: AnomalyService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InformationComponent,
        BreadcrumbComponent,
        RetractationComponent,
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        NgxLoadingModule,
      ],
      providers: [
        ReportStorageService,
        AnomalyService,
        {provide: AnalyticsService, useClass: MockAnalyticsService}
      ]
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .overrideTemplate(RetractationComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    anomalyService = TestBed.inject(AnomalyService);
    reportStorageService = TestBed.inject(ReportStorageService);
    spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(genDraftReport(Step.Category)));

    fixture = TestBed.createComponent(InformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display information when a report refers to anomaly with information', () => {

    const anomalyFixture: Anomaly = {
      categoryId: '',
      category: '',
      path: '',
      subcategories: [],
      information: {
        title: 'titre',
        content: 'contenu',
      }
    };
    spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);

    component.ngOnInit();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelectorAll('p')[0].textContent).toEqual(anomalyFixture.information?.title);
  });
});
