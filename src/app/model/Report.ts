import { Consumer } from './Consumer';
import { Company } from './Company';
import { Subcategory } from './Anomaly';
import { Step } from '../services/report-router.service';
import { UploadedFile } from './UploadedFile';
import moment from 'moment';

export class Report {

  category: string;
  subcategories: Subcategory[];
  company: Company;
  details: ReportDetails;
  detailInputValues: DetailInputValue[];
  uploadedFiles: UploadedFile[];
  consumer: Consumer;
  contactAgreement: boolean;
  internetPurchase: boolean;
  retrievedFromStorage: boolean;
  storedStep: Step;

}

export class DetailInputValue {
  private _label: string;
  private _value: string | Date;
  renderedLabel: string;
  renderedValue: string;

  set value(value: string | Date) {
    this._value = value;
    if (this._value instanceof Date) {
      this.renderedValue = moment(this.value).format('DD/MM/YYYY');
    } else {
      if (this._value.indexOf(PrecisionKeyword) !== -1) {
        this.renderedValue = this._value.replace(PrecisionKeyword, '(').concat(')');
      }
    }
  }

  get value() {
    return this._value;
  }

  set label(label: string) {
    this._label = label;
    if (this._label.endsWith('?')) {
      this.renderedLabel = this.label.replace('?', ':');
    } else {
      this.renderedLabel = `${this.label} :`;
    }
  }

  get label() {
    return this._label;
  }

}

export class ReportDetails {

  anomalyDate: Date;
  anomalyTimeSlot: number;
  description: string;
  precision?: string | string[];
  otherPrecision?: string;

}

export const PrecisionKeyword = '(à préciser)';
