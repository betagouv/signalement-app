import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Consumer } from '../../../model/Consumer';

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.scss']
})
export class ConsumerComponent implements OnInit {

  @Input() initialValue: Consumer;

  consumerForm: FormGroup;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  emailCtrl: FormControl;

  showErrors: boolean;

  @Output() validate = new EventEmitter();

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initConsumerForm();
  }

  initConsumerForm() {
    this.firstNameCtrl = this.formBuilder.control(this.initialValue ? this.initialValue.firstName : '', Validators.required);
    this.lastNameCtrl = this.formBuilder.control(this.initialValue ? this.initialValue.lastName : '', Validators.required);
    this.emailCtrl = this.formBuilder.control(this.initialValue ? this.initialValue.email : '', [Validators.required, Validators.email]);

    this.consumerForm = this.formBuilder.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      email: this.emailCtrl,
    });
  }

  submitConsumerForm() {
    if (!this.consumerForm.valid) {
      this.showErrors = true;
    } else {
      const consumer = new Consumer();
      consumer.firstName = this.firstNameCtrl.value;
      consumer.lastName = this.lastNameCtrl.value;
      consumer.email = this.emailCtrl.value;
      this.validate.emit(consumer);
    }
  }
}
