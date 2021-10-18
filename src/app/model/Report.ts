import { Consumer } from './Consumer';
import { CompanyKinds, DraftCompany, ReportTag, Subcategory, WebsiteURL, } from '@signal-conso/signalconso-api-sdk-js';
import { FileOrigin, UploadedFile } from './UploadedFile';
import { isDefined } from '@angular/compiler/src/util';
import format from 'date-fns/format';
import { CompanySearchResult } from './Company';
import _uniqby from 'lodash.uniqby';

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

export enum ReportStatus {
  NA = 'NA',
  EmployeeConsumer = 'Lanceur d\'alerte',
  InProgress = 'Traitement en cours',
  Unread = 'Signalement non consulté',
  UnreadForPro = 'Non consulté',
  Transmitted = 'Signalement transmis',
  ToReviewedByPro = 'À répondre',
  Accepted = 'Promesse action',
  ClosedForPro = 'Clôturé',
  Rejected = 'Signalement infondé',
  Ignored = 'Signalement consulté ignoré',
  NotConcerned = 'Signalement mal attribué'
}

export class DraftReport {
  category: string;
  subcategories?: Subcategory[];
  draftCompany: DraftCompany;
  detailInputValues: DetailInputValue[];
  uploadedFiles: UploadedFile[];
  consumer: Consumer;
  employeeConsumer?: boolean;
  contactAgreement: boolean;
  retrievedFromStorage: boolean;
  forwardToReponseConso?: boolean;
  storedStep: Step;
  vendor: string;

  get companyKind() {
    return this.lastSubcategory ? this.lastSubcategory.companyKind || CompanyKinds.SIRET : CompanyKinds.SIRET;
  }

  get lastSubcategory() {
    if (this.subcategories && this.subcategories.length) {
      return this.subcategories[this.subcategories.length - 1];
    }
  }

  get reponseconsoCode(): string[] {
    const collectedCodes = !this.subcategories ? [] : [].concat(...this.subcategories.flatMap(subcategory => subcategory.reponseconsoCode || []));
    return _uniqby(collectedCodes, _ => _);
  }

  get tags() {
    const tags = !this.subcategories ? [] : [].concat(...this.subcategories.map(subcategory => subcategory.tags || []));
    if (this.companyKind === CompanyKinds.WEBSITE) {
      tags.push(ReportTag.Internet);
    }
    if (!this.forwardToReponseConso) {
      return tags.filter(_ => _ !== ReportTag.ReponseConso);
    }
    return tags;
  }

  /** @deprecated use pure isContractualDispute() function */
  get isContractualDispute() {
    return !this.employeeConsumer && this.tags.indexOf(ReportTag.LitigeContractuel) !== -1;
  }

  get isVendor() {
    return this.tags?.indexOf(ReportTag.ProduitDangereux) !== -1;
  }

  get isTransmittableToPro() {
    return !this.employeeConsumer && !this.forwardToReponseConso && !this.tags?.find(_ => ([ReportTag.ProduitDangereux, ReportTag.Bloctel]).includes(_));
  }
}

export const isContractualDispute = (_: DraftReport) => !_.employeeConsumer && _.tags.indexOf(ReportTag.LitigeContractuel) !== -1;

export class Report {
  id: string;
  category: string;
  subcategories: Subcategory[];
  tags: ReportTag[];
  company: CompanySearchResult;
  website: WebsiteURL;
  vendor: string;
  phone: string;
  detailInputValues: DetailInputValue[];
  uploadedFiles: UploadedFile[];
  consumer: Consumer;
  employeeConsumer: boolean;
  contactAgreement: boolean;
  forwardToReponseConso?: boolean;
  creationDate: Date;
  status: string;

  get consumerUploadedFiles() {
    return this.uploadedFiles ? this.uploadedFiles.filter(file => file.origin === FileOrigin.Consumer) : [];
  }

  get professionalUploadedFiles() {
    return this.uploadedFiles ? this.uploadedFiles.filter(file => file.origin === FileOrigin.Professional) : [];
  }

  get isTransmittableToPro() {
    return !this.employeeConsumer && this.tags?.indexOf(ReportTag.ProduitDangereux) === -1;
  }
}

export class DetailInputValue {
  private _label: string;
  private _value: string | Date | Array<string>;
  renderedLabel: string;
  renderedValue: string;

  set value(value: string | Date | Array<string>) {
    this._value = value;
    if (this._value instanceof Date) {
      this.renderedValue = format(this._value, 'dd/MM/yyyy');
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
