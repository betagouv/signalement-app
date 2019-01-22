import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportDetails } from '../../../model/Report';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  detailsForm: FormGroup;
  anomalyDateCtrl: FormControl;
  anomalyTimeSlotCtrl: FormControl;
  descriptionCtrl: FormControl;

  plageHoraireList: number[];
  ticketFile: File;
  anomalyFile: File;

  showErrors: boolean;

  @Output() submit = new EventEmitter();

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initDetailsForm();
    this.constructPlageHoraireList();
  }

  initDetailsForm() {
    this.showErrors = false;

    this.descriptionCtrl = this.formBuilder.control('');
    this.anomalyDateCtrl = this.formBuilder.control('', Validators.required);
    this.anomalyTimeSlotCtrl = this.formBuilder.control('');

    this.detailsForm = this.formBuilder.group({
      anomalyDate: this.anomalyDateCtrl,
      anomalyTimeSlot: this.anomalyTimeSlotCtrl,
      description: this.descriptionCtrl
    });

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
      this.submit.emit(reportDetails);
    }
  }

}
