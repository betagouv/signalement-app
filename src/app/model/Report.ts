import { Consumer } from './Consumer';
import { Company } from './Company';
import { Subcategory } from './Anomaly';
import { UploadedFile } from './UploadedFile';
import moment from 'moment';
import { isDefined } from '@angular/compiler/src/util';

export const PrecisionKeyword = '(à préciser)';

export enum Step {
  Category = 'Category',
  Problem = 'Problem',
  Details = 'Details',
  Company = 'Company',
  Consumer = 'Consumer',
  Confirmation = 'Confirmation',
  Acknowledgment = 'Acknowledgment',
  Information = 'Information'
}

export class Report {
  id: string;
  category: string;
  subcategories: Subcategory[];
  company: Company;
  detailInputValues: DetailInputValue[];
  uploadedFiles: UploadedFile[];
  consumer: Consumer;
  contactAgreement: boolean;
  internetPurchase: boolean;
  retrievedFromStorage: boolean;
  creationDate: Date;
  storedStep: Step;
  statusPro: string;
  statusConso: string;
}

export class DetailInputValue {
  private _label: string;
  private _value: string | Date | Array<string>;
  renderedLabel: string;
  renderedValue: string;

  set value(value: string | Date | Array<string>) {
    this._value = value;
    if (this._value instanceof Date) {
      this.renderedValue = moment(this._value).format('DD/MM/YYYY');
    } else if (this._value instanceof Array) {
      this.renderedValue = this._value
        .filter(v => isDefined(v))
        .map(v => {
          if (v.indexOf(PrecisionKeyword) !== -1) {
            return v.replace(PrecisionKeyword, '(').concat(')');
          } else {
            return v;
          }
        })
        .reduce((v1, v2) => `${v1}, ${v2}`);
    } else if (this._value && this._value.indexOf && this._value.indexOf(PrecisionKeyword) !== -1) {
      this.renderedValue = this._value.replace(PrecisionKeyword, '(').concat(')');
    } else {
      this.renderedValue = value as string;
    }
  }

  get value() {
    return this._value;
  }

  set label(label: string) {
    this._label = label;
    this.renderedLabel = label;
    if (this.renderedLabel.endsWith('?')) {
      this.renderedLabel = this.renderedLabel.replace('?', ':');
    }
    if (!this.renderedLabel.endsWith(':')) {
      this.renderedLabel = `${this.renderedLabel} :`;
    }
  }

  get label() {
    return this._label;
  }

}
