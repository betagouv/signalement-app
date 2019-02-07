import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Report, ReportDetails } from '../../../model/Report';
import { BsLocaleService } from 'ngx-bootstrap';
import { ReportService, Step } from '../../../services/report.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  step: Step;
  report: Report;

  detailsForm: FormGroup;
  precisionCtrl: FormControl;
  anomalyDateCtrl: FormControl;
  anomalyTimeSlotCtrl: FormControl;
  descriptionCtrl: FormControl;

  plageHoraireList: number[];
  ticketFile: File;
  anomalyFile: File;

  showErrors: boolean;

  constructor(public formBuilder: FormBuilder,
              private reportService: ReportService,
              private analyticsService: AnalyticsService,
              private localeService: BsLocaleService) {
  }

  ngOnInit() {
    this.step = Step.Details;
    this.reportService.currentReport.subscribe(report => {
      if (report) {
        this.report = report;
        this.initDetailsForm();
        this.constructPlageHoraireList();
      } else {
        this.reportService.reinit();
      }
    });
    this.localeService.use('fr');
  }

  initDetailsForm() {
    this.showErrors = false;

    this.descriptionCtrl = this.formBuilder.control(this.report.details ? this.report.details.description : '');
    this.anomalyDateCtrl = this.formBuilder.control(
      this.report.details ? this.report.details.anomalyDate : new Date(), Validators.required
    );
    this.anomalyTimeSlotCtrl = this.formBuilder.control(this.report.details ? this.report.details.anomalyTimeSlot : '');
    this.precisionCtrl = this.formBuilder.control(this.report.details ? this.report.details.precision : '', Validators.required);

    this.detailsForm = this.formBuilder.group({
      anomalyDate: this.anomalyDateCtrl,
      anomalyTimeSlot: this.anomalyTimeSlotCtrl,
      description: this.descriptionCtrl
    });

    if (this.report.subcategory && this.report.subcategory.details && this.report.subcategory.details.precision) {
      this.detailsForm.addControl('precision', this.precisionCtrl);
    }

  }

  constructPlageHoraireList() {
    this.plageHoraireList = [];
    for (let i = 0; i < 24; i++) {
      this.plageHoraireList.push(i);
    }
  }

  onTicketFileSelected(file: File) {
    this.ticketFile = file;
  }

  onAnomalyFileSelected(file: File) {
    this.anomalyFile = file;
  }

  submitDetailsForm() {
    if (!this.detailsForm.valid) {
      this.showErrors = true;
    } else {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateDetails);
      const reportDetails = new ReportDetails();
      reportDetails.precision = this.precisionCtrl.value;
      reportDetails.anomalyDate = this.anomalyDateCtrl.value;
      reportDetails.anomalyTimeSlot = this.anomalyTimeSlotCtrl.value;
      reportDetails.description = this.descriptionCtrl.value;
      reportDetails.ticketFile = this.ticketFile;
      reportDetails.anomalyFile = this.anomalyFile;
      this.report.details = reportDetails;
      this.reportService.changeReport(this.report, this.step);
    }
  }

}
