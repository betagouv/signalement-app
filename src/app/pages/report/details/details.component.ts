import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Report, ReportDetails } from '../../../model/Report';
import { BsLocaleService } from 'ngx-bootstrap';
import { ReportService, Step } from '../../../services/report.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Information } from '../../../model/Anomaly';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  step: Step;
  report: Report;

  detailsForm: FormGroup;
  singlePrecisionCtrl: FormControl;
  multiplePrecisionCtrl: FormArray;
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

    this.detailsForm = this.formBuilder.group({
      anomalyDate: this.anomalyDateCtrl,
      anomalyTimeSlot: this.anomalyTimeSlotCtrl,
      description: this.descriptionCtrl
    });

    if (this.report.subcategory && this.report.subcategory.details && this.report.subcategory.details.precision) {
      const precision = this.report.subcategory.details.precision;
      if (precision.severalOptionsAllowed) {
        this.multiplePrecisionCtrl = new FormArray(
          precision.options.map(option =>
            this.formBuilder.control( this.isOptionChecked(option) ? true : false)
          )
        );
        this.detailsForm.addControl('multiplePrecision', this.multiplePrecisionCtrl);
      } else {
        this.singlePrecisionCtrl = this.formBuilder.control(this.report.details ? this.report.details.precision : '', Validators.required);
        this.detailsForm.addControl('singlePrecision', this.singlePrecisionCtrl);
      }
    }
  }

  isOptionChecked(option: Information) {
    return this.report.details && this.report.details.precision && this.report.details.precision.indexOf(option.title) !== -1;
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
      if (this.getPrecisionFromCtrl()) {
        reportDetails.precision = this.getPrecisionFromCtrl();
      }
      reportDetails.anomalyDate = this.anomalyDateCtrl.value;
      reportDetails.anomalyTimeSlot = this.anomalyTimeSlotCtrl.value;
      reportDetails.description = this.descriptionCtrl.value;
      reportDetails.ticketFile = this.ticketFile;
      reportDetails.anomalyFile = this.anomalyFile;
      this.report.details = reportDetails;
      this.reportService.changeReport(this.report, this.step);
    }
  }


  getPrecisionFromCtrl() {
    if (this.singlePrecisionCtrl) {
      return this.singlePrecisionCtrl.value;
    } else if (this.multiplePrecisionCtrl) {
      return this.multiplePrecisionCtrl.controls
        .map((control, index) => {
          return control.value ? this.report.subcategory.details.precision.options[index].title : null;
        })
        .filter(value => value !== null);
    }
  }


}
