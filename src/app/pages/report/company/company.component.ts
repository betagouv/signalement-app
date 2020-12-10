import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { DraftReport, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { take } from 'rxjs/operators';
import { CompanyKinds } from '../../../model/Anomaly';
import { DraftCompany, WebsiteURL } from '../../../model/Company';
import { RendererService } from '../../../services/renderer.service';

export enum IdentificationKinds {
  Name = 'Name', Identity = 'Identity', None = 'None', Url = 'Url'
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  @ViewChild('searchKind')
  private searchKind: ElementRef;
  @ViewChild('identSearch')
  private identSearch: ElementRef;

  step: Step;
  draftReport: DraftReport;
  companyKinds = CompanyKinds;

  identificationKinds = IdentificationKinds;
  identificationKind: IdentificationKinds;

  changeDraftCompany = false;
  draftWebsite: WebsiteURL;
  requireIdentificationKind: boolean;

  loading: boolean;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              public formBuilder: FormBuilder,
              private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService,
              private analyticsService: AnalyticsService,
              private rendererService: RendererService) { }

  ngOnInit() {
    this.step = Step.Company;
    this.reportStorageService.retrieveReportInProgress()
      .pipe(take(1))
      .subscribe(report => {
        if (report) {
          this.draftReport = report;
          this.checkExistingCompanyCompliance();
          if (this.draftReport.companyKind === CompanyKinds.WEBSITE) {
            this.requireIdentificationKind = false;
          } else {
            this.requireIdentificationKind = true;
          }
        } else {
          this.reportRouterService.routeToFirstStep();
        }
      });
  }

  checkExistingCompanyCompliance() {
    const draftCompany = this.draftReport.draftCompany;
    if (draftCompany) {
      if ((this.draftReport.companyKind === CompanyKinds.SIRET && draftCompany.website) ||
        (this.draftReport.companyKind === CompanyKinds.WEBSITE && !draftCompany.website)) {
        this.draftReport.draftCompany = undefined;
      }
    }
  }

  submitWebsite(draftCompany: DraftCompany & {vendor?: string}) {
    this.draftWebsite = draftCompany.website;
    if (draftCompany.name) {
      this.submitCompany(draftCompany);
    } else {
      this.requireIdentificationKind = true;
      this.rendererService.scrollToElement(this.searchKind.nativeElement);
    }
  }

  submitCompany(draftCompany?: DraftCompany & {vendor?: string}) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCompany, this.identificationKind);
    this.draftReport.draftCompany = {
      ...draftCompany,
      website: this.draftWebsite
    };
    this.draftReport.vendor = draftCompany.vendor;
    this.changeDraftCompany = false;
    this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
    this.reportRouterService.routeForward(this.step);
  }

  changeCompany() {
    this.changeDraftCompany = true;
  }

  selectIdentificationKind(identificationKind: IdentificationKinds) {
    this.rendererService.scrollToElement(this.identSearch.nativeElement);
  }
}
