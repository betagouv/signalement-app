import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationComponent } from './information.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportService } from '../../../services/report.service';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { Anomaly, Information } from '../../../model/Anomaly';
import { AnomalyService } from '../../../services/anomaly.service';
import { of } from 'rxjs';
import { Report } from '../../../model/Report';
import { RetractationComponent } from '../../infos/retractation/retractation.component';

describe('InformationComponent', () => {

  let component: InformationComponent;
  let fixture: ComponentFixture<InformationComponent>;
  let reportService: ReportService;
  let anomalyService: AnomalyService;

  const reportFixture = new Report();
  reportFixture.category = 'catégorie';

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
      ],
      providers: [
        ReportService,
        AnomalyService,
      ]
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .overrideTemplate(RetractationComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    anomalyService = TestBed.get(AnomalyService);
    reportService = TestBed.get(ReportService);
    reportService.currentReport = of(reportFixture);

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
    expect(nativeElement.querySelector('.title').textContent).toEqual(anomalyFixture.information.title);
  });
});
