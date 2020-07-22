import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryComponent, IllustrationCardComponent } from './category.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { AnomalyService } from '../../../services/anomaly.service';
import { Anomaly } from '../../../model/Anomaly';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ReportPaths, ReportRouterService } from '../../../services/report-router.service';
import { AlertModule } from 'ngx-bootstrap';
import { HeaderModule } from '../../header/header.module';

describe('CategoryComponent', () => {

  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let anomalyService: AnomalyService;
  let location: Location;
  let router: Router;
  let reportRouterService: ReportRouterService;

  const primaryAnomaly1 = Object.assign(new Anomaly(), {
    category: 'category1',
    path: 'path1',
    rank: 1
  });
  const primaryAnomalyWithInformation = Object.assign(new Anomaly(), {
    category: 'category2',
    path: 'path2',
    rank: 2,
    information: {
      title: 'titre',
      content: 'contenu'
    }
  });
  const secondaryAnomaly = Object.assign(new Anomaly(), {
    rank: 100
  });
  const anomaliesFixture = [primaryAnomaly1, primaryAnomalyWithInformation, secondaryAnomaly];


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CategoryComponent,
        IllustrationCardComponent,
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        AlertModule.forRoot(),
        Angulartics2RouterlessModule.forRoot(),
        HeaderModule
      ],
      providers: [
        AnomalyService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    location = TestBed.get(Location);
    router = TestBed.get(Router);
    anomalyService = TestBed.get(AnomalyService);
    reportRouterService = TestBed.get(ReportRouterService);
    spyOn(anomalyService, 'getAnomalies').and.returnValue(anomaliesFixture);

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display only primary categories', () => {
    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelectorAll('.category').length).toEqual(2);
  });

  it('should route to information page when a category with information is selected', () => {
    const routerSpy = spyOn(router, 'navigate');
    const nativeElement = fixture.nativeElement;
    nativeElement.querySelectorAll('.category')[1].click();
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith([primaryAnomalyWithInformation.path, ReportPaths.Information]);
  });

  it('should route to details page when a category with no information is selected', () => {
    const routerSpy = spyOn(router, 'navigate');
    const nativeElement = fixture.nativeElement;
    nativeElement.querySelectorAll('.category')[0].click();
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith([primaryAnomaly1.path, ReportPaths.Details]);
  });

});
