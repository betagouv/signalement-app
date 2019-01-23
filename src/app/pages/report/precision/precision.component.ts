import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Precision } from '../../../model/Anomaly';

@Component({
  selector: 'app-precision',
  templateUrl: './precision.component.html',
  styleUrls: ['./precision.component.scss']
})
export class PrecisionComponent implements OnInit {

  @Input() initialValue: Precision;
  @Input() anomalyPrecisionList: Precision[];

  precisionForm: FormGroup;
  anomalyPrecisionCtrl: FormControl;

  showErrors: boolean;

  @Output() validate = new EventEmitter<Precision>();

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initPrecisionForm();
  }

  initPrecisionForm() {
    this.showErrors = false;

    this.anomalyPrecisionCtrl = this.formBuilder.control(this.initialValue ? this.initialValue : '', Validators.required);

    this.precisionForm = this.formBuilder.group({
      anomalyPrecision: this.anomalyPrecisionCtrl
    });
  }

  submitPrecisionForm() {
    if (!this.precisionForm.valid) {
      this.showErrors = true;
      return false;
    } else {
      this.validate.emit(
        this.anomalyPrecisionList.find(precision => precision.title === this.anomalyPrecisionCtrl.value)
      );
    }
  }
}
