import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportStorageService } from '../../../services/report-storage.service';
import { DraftReport, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { take } from 'rxjs/operators';
import { Country } from '../../../model/Country';
import { combineLatest } from 'rxjs';
import { ConstantService } from '../../../services/constant.service';

@Component({
  selector: 'app-acknowledgment',
  templateUrl: './acknowledgment.component.html',
  styleUrls: ['./acknowledgment.component.scss']
})
export class AcknowledgmentComponent implements OnInit, OnDestroy {

  step: Step;
  draftReport: DraftReport;

  foreignCountry?: Country;

  constructor(private reportStorageService: ReportStorageService,
              private constantService: ConstantService,
              private reportRouterService: ReportRouterService) { }

  ngOnInit() {
    this.step = Step.Acknowledgment;
    combineLatest([
      this.reportStorageService.retrieveReportInProgress().pipe(take(1)),
      this.constantService.getCountries()
    ]).subscribe(([draftReport, countries]) => {
        if (draftReport) {
          this.draftReport = draftReport;
          this.foreignCountry = countries.find(country => country.name === draftReport.draftCompany.country);
        } else {
          this.reportRouterService.routeToFirstStep();
        }
      });
  }

  ngOnDestroy() {
    this.reportStorageService.removeReportInProgress();
  }

  newReport() {
    this.reportStorageService.removeReportInProgress();
    this.reportRouterService.routeToFirstStep();
  }

}
