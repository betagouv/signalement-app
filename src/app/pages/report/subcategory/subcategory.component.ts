import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Anomaly } from '../../../model/Anomaly';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportService, Step } from '../../../services/report.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Report } from '../../../model/Report';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {

  step: Step;
  report: Report;
  anomaly: Anomaly;

  subcategoryForm: FormGroup;
  anomalySubcategoryCtrl: FormControl;

  showErrors: boolean;
  internetPurchase: boolean;

  constructor(public formBuilder: FormBuilder,
              private anomalyService: AnomalyService,
              private reportService: ReportService,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.step = Step.Subcategory;
    this.reportService.currentReport.subscribe(report => {
      if (report) {
        this.report = report;
        this.initSubcategoryForm();
        this.initSubcategories();
      } else {
        this.reportService.reinit();
      }
    });
  }

  initSubcategories() {
    const anomaly = this.anomalyService.getAnomalyByCategory(this.report.category);
    if (anomaly && anomaly.subcategories) {
      this.anomaly = anomaly;
    } else {
      this.reportService.reinit();
    }
  }

  initSubcategoryForm() {
    this.showErrors = false;

    this.anomalySubcategoryCtrl = this.formBuilder.control(
      this.report.subcategory ? this.report.subcategory.title : '', Validators.required
    );

    this.subcategoryForm = this.formBuilder.group({
      anomalySubcategory: this.anomalySubcategoryCtrl
    });
  }

  submitSubcategoryForm() {
    if (!this.subcategoryForm.valid) {
      this.showErrors = true;
      return false;
    } else {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateSubcategory, this.anomalySubcategoryCtrl.value);
      this.report.subcategory = this.anomaly.subcategories.find(subcategory => subcategory.title === this.anomalySubcategoryCtrl.value);
      this.reportService.changeReport(this.report, this.step);
    }
  }

  setInternetPurchase(internetPurchase: boolean) {
    this.internetPurchase = internetPurchase;
    if (this.internetPurchase) {
      this.report.category = 'Problème suite à un achat sur internet';
      this.reportService.changeReport(this.report, Step.Category);
    }
  }
}
