import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgmentComponent } from './acknowledgment.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportStorageService } from '../../../services/report-storage.service';
import { genDraftReport } from '../../../../../test/fixtures.spec';

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
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    reportStorageService = TestBed.get(ReportStorageService);
    reportStorageService.changeReportInProgress(genDraftReport());

    fixture = TestBed.createComponent(AcknowledgmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
