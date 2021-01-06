import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgmentComponent } from './acknowledgment.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportStorageService } from '../../../services/report-storage.service';
import { genDraftReport } from '../../../../../test/fixtures.spec';
import { Step } from '../../../model/Report';
import { of } from 'rxjs';
import { AnalyticsService } from '../../../services/analytics.service';
import { MockAnalyticsService } from '../../../../../test/mocks';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { ConstantService } from '../../../services/constant.service';

describe('AcknoledgmentComponent', () => {

  let component: AcknowledgmentComponent;
  let fixture: ComponentFixture<AcknowledgmentComponent>;
  let reportStorageService: ReportStorageService;
  let constantService: ConstantService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcknowledgmentComponent ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        ComponentsModule,
        PipesModule,
      ],
      providers: [
        {provide: AnalyticsService, useClass: MockAnalyticsService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    constantService = TestBed.inject(ConstantService);
    reportStorageService = TestBed.inject(ReportStorageService);
    spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(genDraftReport(Step.Confirmation)));
    spyOn(constantService, 'getCountries').and.returnValue(of([{'code': 'AFG', 'name': 'Afghanistan', 'european': false, 'transfer': false}]));

    fixture = TestBed.createComponent(AcknowledgmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
