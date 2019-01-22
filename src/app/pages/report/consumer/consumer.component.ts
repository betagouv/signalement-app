import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Consumer } from '../../../model/Consumer';

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.scss']
})
export class ConsumerComponent implements OnInit {

  consumerForm: FormGroup;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  emailCtrl: FormControl;

  showErrors: boolean;

  @Output() submit = new EventEmitter();

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initConsumerForm();
  }

  initConsumerForm() {
    this.firstNameCtrl = this.formBuilder.control('', Validators.required);
    this.lastNameCtrl = this.formBuilder.control('', Validators.required);
    this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);

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
      this.submit.emit(consumer);
    }
  }
}
