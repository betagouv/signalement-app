import { Consumer } from './Consumer';
import {
  Bloctel,
  CompanyKinds,
  ContractualDisputeTag,
  DangerousProductTag,
  InternetTag,
  ReponseConsoTag,
  Subcategory,
  Tag
} from './Anomaly';
import { FileOrigin, UploadedFile } from './UploadedFile';
import { isDefined } from '@angular/compiler/src/util';
import { DraftCompany, WebsiteURL } from '@betagouv/signalconso-api-sdk-js';
import format from 'date-fns/format';
import { CompanySearchResult } from './Company';

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

  get tags() {
    const tags = !this.subcategories ? [] : [].concat(...this.subcategories.map(subcategory => subcategory.tags || []));
    if (this.companyKind === CompanyKinds.WEBSITE) {
      tags.push(InternetTag);
    }
    if (!this.forwardToReponseConso) {
      return tags.filter(_ => _ !== ReponseConsoTag);
    }
    return tags;
  }

  /** @deprecated use pure isContractualDispute() function */
  get isContractualDispute() {
    return !this.employeeConsumer && this.tags.indexOf(ContractualDisputeTag) !== -1;
  }

  get isVendor() {
    return this.tags?.indexOf(DangerousProductTag) !== -1;
  }

  get isTransmittableToPro() {
    return !this.employeeConsumer && !this.forwardToReponseConso && !this.tags?.find(_ => ([DangerousProductTag, Bloctel]).includes(_));
  }
}

export const isContractualDispute = (_: DraftReport) => !_.employeeConsumer && _.tags.indexOf(ContractualDisputeTag) !== -1;

export class Report {
  id: string;
  category: string;
  subcategories: Subcategory[];
  tags: Tag[];
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
    return !this.employeeConsumer && this.tags?.indexOf(DangerousProductTag) === -1;
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
