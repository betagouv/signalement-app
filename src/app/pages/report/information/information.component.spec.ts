import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationComponent } from './information.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { Anomaly, Information } from '../../../model/Anomaly';
import { AnomalyService } from '../../../services/anomaly.service';
import { DraftReport } from '../../../model/Report';
import { RetractationComponent } from '../../static/retractation/retractation.component';
import { ReportStorageService } from '../../../services/report-storage.service';
import { NgxLoadingModule } from 'ngx-loading';

describe('InformationComponent', () => {

  let component: InformationComponent;
  let fixture: ComponentFixture<InformationComponent>;
  let reportStorageService: ReportStorageService;
  let anomalyService: AnomalyService;

  const draftReportFixture = new DraftReport();
  draftReportFixture.category = 'catégorie';

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
        Angulartics2RouterlessModule.forRoot(),
        NgxLoadingModule,
      ],
      providers: [
        ReportStorageService,
        AnomalyService,
      ]
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .overrideTemplate(RetractationComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    anomalyService = TestBed.get(AnomalyService);
    reportStorageService = TestBed.get(ReportStorageService);
    reportStorageService.changeReportInProgress(draftReportFixture);

    fixture = TestBed.createComponent(InformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display information when a report refers to anomaly with information', () => {

    const anomalyFixture = new Anomaly();
    anomalyFixture.information = new Information();
    anomalyFixture.information.title = 'titre';
    anomalyFixture.information.content = 'contenu';
    spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);

    component.ngOnInit();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelectorAll('p')[0].textContent).toEqual(anomalyFixture.information.title);
  });
});
