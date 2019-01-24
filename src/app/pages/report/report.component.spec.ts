import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntoxicationAlimentaire, ReportComponent, Step } from './report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnomalyService } from '../../services/anomaly.service';
import { Anomaly } from '../../model/Anomaly';
import { of } from 'rxjs';
import { deserialize } from 'json-typescript-mapper';
import { HttpClientModule } from '@angular/common/http';
import { ReportService } from '../../services/report.service';
import { ServiceUtils } from '../../services/service.utils';
import { FileInputComponent } from '../../components/file-input/file-input.component';
import { Component } from '@angular/core';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DetailsComponent } from './details/details.component';
import { ConsumerComponent } from './consumer/consumer.component';
import { PrecisionComponent } from './precision/precision.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
import { PrecedeByPipe } from '../../pipes/precede-by.pipe';


describe('ReportComponent', () => {

  @Component({
    selector: 'app-company',
    template: ''
  })
  class CompanyFormComponent {}

  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  let anomalyService: AnomalyService;
  let reportService: ReportService;

  const precisionList1 = [
    { title: 'title11', description: 'description11' },
    { title: 'title12', description: 'description12' },
  ];
  const precisionList2 = [
    { title: 'title21', description: 'description21' },
    { title: 'title22', description: 'description22' },
    { title: 'title23', description: 'description23' },
  ];
  const anomaly1 = deserialize(Anomaly, {category: 'category1', rank: '1', precisionList: precisionList1});
  const anomaly2 = deserialize(Anomaly, {category: 'category2', rank: '2', precisionList: precisionList2});
  const anomalyIntoxicationAlimentaire = deserialize(Anomaly, {category: IntoxicationAlimentaire, rank: '3', information: { title: 'Titre intox', content: 'contentIntox'}});

  const anomaliesFixture = [anomaly1, anomaly2, anomalyIntoxicationAlimentaire];

  const anomalyInfosFixture = [
    { key: 'Etablissement hors périmètre', title: '', info: 'infoHP' },
    { key: precisionList2[0], title: 'title220', info: 'info220' },
    { key: precisionList2[2], title: 'title222', info: 'info222' },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportComponent,
        FileInputComponent,
        CompanyFormComponent,
        BreadcrumbComponent,
        DetailsComponent,
        ConsumerComponent,
        PrecisionComponent,
        ConfirmationComponent,
        PrecedeByPipe,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BsDatepickerModule.forRoot(),
        NgxLoadingModule,
        Angulartics2RouterlessModule.forRoot(),
      ],
      providers: [
        AnomalyService,
        ReportService,
        ServiceUtils,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    anomalyService = TestBed.get(AnomalyService);
    reportService = TestBed.get(ReportService);
    spyOn(anomalyService, 'getAnomalies').and.returnValue(of(anomaliesFixture));
    spyOn(anomalyService, 'getAnomalyInfos').and.returnValue(of(anomalyInfosFixture));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit function', () => {

    it('should load anomaly list and route to the first step', () => {
      component.ngOnInit();

      expect(anomalyService.getAnomalies).toHaveBeenCalled();
      expect(component.anomalies).toEqual(anomaliesFixture);
      expect(component.step).toEqual(Step.Category);
    });
  });

  describe('first step (category)', () => {

    it('should display category blocks', () => {
      component.step = Step.Category;
      component.anomalies = anomaliesFixture;
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('div.category').length).toEqual(anomaliesFixture.length);
    });

    it('should initiate a report and route to precision step when an anomaly without information is clicked', () => {
      component.step = Step.Category;
      component.anomalies = anomaliesFixture;
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelectorAll('div.category')[0].click();

      expect(component.report).not.toBeNull();
      expect(component.report.anomalyCategory).toEqual(anomaly1.category);
      expect(component.step).toEqual(Step.Precision);
    });

    it('should display information when an anomaly with information is clicked', () => {
      component.step = Step.Category;
      component.anomalies = anomaliesFixture;
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelectorAll('div.category')[2].click();
      fixture.detectChanges();

      expect(component.report).toBeUndefined();
      expect(nativeElement.querySelector('h1').textContent).toEqual(anomalyIntoxicationAlimentaire.information.title);
    });

  });

});
