import { Component, OnInit} from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Anomaly, Information } from '../../../model/Anomaly';
import { Report } from '../../../model/Report';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportRouterService, Step } from '../../../services/report-router.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  step: Step;
  report: Report;

  anomalies: Anomaly[];
  showSecondaryCategories: boolean;

  companyType = CompanyType;
  selectedCompanyType: CompanyType;
  internetInformation: Information;

  constructor(private anomalyService: AnomalyService,
              private reportService: ReportService,
              private reportRouterService: ReportRouterService,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.step = Step.Category;
    this.reportService.currentReport.subscribe(report => this.report = report);
    this.selectedCompanyType = CompanyType.Physical;
    this.showSecondaryCategories = false;
    this.loadAnomalies();
    const anomaly = this.anomalyService.findAnomalyOfCategory(this.anomalies, "Problème suite à un achat sur internet");
    this.internetInformation = anomaly.information; 
  }

  loadAnomalies() {
    this.anomalies = this.anomalyService.getAnomalies();
  }

  primaryCategoriesOrderByRank() {
    if (this.anomalies) {
      return this.anomalies
        .filter(a => a.rank < 100)
        .sort((a1, a2) => a1.rank > a2.rank ? 1 : a1.rank === a2.rank ? 0 : -1);
    }
  }

  secondaryCategoriesOrderByRank() {
    if (this.anomalies) {
      return this.anomalies
        .filter(a => a.rank >= 100)
        .sort((a1, a2) => a1.rank > a2.rank ? 1 : a1.rank === a2.rank ? 0 : -1);
    }
  }

  displaySecondaryCategories() {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.secondaryCategories);
    this.showSecondaryCategories = true;
  }

  selectAnomaly(anomaly: Anomaly) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCategory, anomaly.category);
    this.report = new Report();
    this.report.category = anomaly.category;
    this.reportService.changeReportFromStep(this.report, this.step);
    this.reportRouterService.routeForward(this.step);
  }
  
  restoreStoredReport() {
    this.reportService.changeReportFromStep(this.report, this.report.storedStep);
    this.reportRouterService.routeForward(this.report.storedStep);
  }

  removeStoredReport() {
    this.reportService.removeReportFromStorage();
  }

  selectCompanyType(type: CompanyType) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.companyTypeSelection, type);
    this.selectedCompanyType = type;
  }

}

export enum CompanyType {
  Physical = 'Physical',
  Service = 'Service',
  Internet = 'Internet'
}