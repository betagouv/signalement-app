import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgmentComponent } from './acknowledgment.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportStorageService } from '../../../services/report-storage.service';
import { genDraftReport } from '../../../../../test/fixtures.spec';
import { Step } from '../../../model/Report';
import { of } from 'rxjs';
import { AbTestsModule } from 'angular-ab-tests';
import { SVETestingScope, SVETestingVersions } from '../../../utils';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';

describe('AcknoledgmentComponent', () => {

  let component: AcknowledgmentComponent;
  let fixture: ComponentFixture<AcknowledgmentComponent>;
  let reportStorageService: ReportStorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcknowledgmentComponent ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        AbTestsModule.forRoot(
          [
            {
              versions: [ SVETestingVersions.NoTest, SVETestingVersions.Test3_Sentence1 ],
              scope: SVETestingScope,
              weights: { [SVETestingVersions.NoTest]: 99, [SVETestingVersions.Test3_Sentence1]: 0 }
            }
          ]
        ),
        Angulartics2RouterlessModule.forRoot(),
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    reportStorageService = TestBed.get(ReportStorageService);
    spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(genDraftReport(Step.Confirmation)));

    fixture = TestBed.createComponent(AcknowledgmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
