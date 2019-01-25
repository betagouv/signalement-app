import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportDetails } from '../../../model/Report';
import { BsLocaleService } from 'ngx-bootstrap';
import { Precision } from '../../../model/Anomaly';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  @Input() initialValue: ReportDetails;
  @Input() precision: Precision;

  detailsForm: FormGroup;
  precisionCtrl: FormControl;
  anomalyDateCtrl: FormControl;
  anomalyTimeSlotCtrl: FormControl;
  descriptionCtrl: FormControl;

  plageHoraireList: number[];
  ticketFile: File;
  anomalyFile: File;

  showErrors: boolean;

  @Output() validate = new EventEmitter();

  constructor(public formBuilder: FormBuilder,
    private localeService: BsLocaleService) { }

  ngOnInit() {
    this.localeService.use('fr');
    this.initDetailsForm();
    this.constructPlageHoraireList();
  }

  initDetailsForm() {
    this.showErrors = false;

    this.descriptionCtrl = this.formBuilder.control(this.initialValue ? this.initialValue.description : '');
    this.anomalyDateCtrl = this.formBuilder.control(this.initialValue ? this.initialValue.anomalyDate : new Date(), Validators.required);
    this.anomalyTimeSlotCtrl = this.formBuilder.control(this.initialValue ? this.initialValue.anomalyTimeSlot : '');
    this.precisionCtrl = this.formBuilder.control(this.initialValue ? this.initialValue.precision : '', Validators.required);

    this.detailsForm = this.formBuilder.group({
      anomalyDate: this.anomalyDateCtrl,
      anomalyTimeSlot: this.anomalyTimeSlotCtrl,
      description: this.descriptionCtrl
    });

    if (this.precision) {
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
      const reportDetails = new ReportDetails();
      reportDetails.anomalyDate = this.anomalyDateCtrl.value;
      reportDetails.anomalyTimeSlot = this.anomalyTimeSlotCtrl.value;
      reportDetails.description = this.descriptionCtrl.value;
      reportDetails.ticketFile = this.ticketFile;
      reportDetails.anomalyFile = this.anomalyFile;
      this.validate.emit(reportDetails);
    }
  }

}
