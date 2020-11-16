import { Consumer } from './Consumer';
import { CompanyKinds, ContractualDisputeTag, InternetTag, Subcategory, Tag } from './Anomaly';
import { FileOrigin, UploadedFile } from './UploadedFile';
import moment from 'moment';
import { isDefined } from '@angular/compiler/src/util';
import { Company, DraftCompany, Website } from './Company';

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

export const reportStatusColor = {
  [ReportStatus.NA]: '#c7c7c7',
  [ReportStatus.EmployeeConsumer]: '#0288d1',
  [ReportStatus.InProgress]: '#FF8000',
  [ReportStatus.Unread]: '#5f6368',
  [ReportStatus.UnreadForPro]: '#5f6368',
  [ReportStatus.Transmitted]: '#0288d1',
  [ReportStatus.ToReviewedByPro]: '#FF8000',
  [ReportStatus.Accepted]: '#00c616',
  [ReportStatus.Rejected]: '#0288d1',
  [ReportStatus.ClosedForPro]: '#0288d1',
  [ReportStatus.Ignored]: '#dd2c00',
  [ReportStatus.NotConcerned]: '#5f6368',
};

export const reportStatusIcon = {
  [ReportStatus.NA]: '',
  [ReportStatus.EmployeeConsumer]: 'admin_panel_settings',
  [ReportStatus.InProgress]: 'pending',
  [ReportStatus.Unread]: 'mark_email_unread',
  [ReportStatus.UnreadForPro]: 'mark_email_unread',
  [ReportStatus.Transmitted]: 'mark_email_read',
  [ReportStatus.ToReviewedByPro]: 'query_builder',
  [ReportStatus.Accepted]: 'check_circle',
  [ReportStatus.Rejected]: 'help',
  [ReportStatus.ClosedForPro]: 'archive',
  [ReportStatus.Ignored]: 'block',
  [ReportStatus.NotConcerned]: 'delete',
};

export class DraftReport {
  category: string;
  subcategories: Subcategory[];
  draftCompany: DraftCompany;
  detailInputValues: DetailInputValue[];
  uploadedFiles: UploadedFile[];
  consumer: Consumer;
  employeeConsumer: boolean;
  contactAgreement: boolean;
  retrievedFromStorage: boolean;
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
    return tags;
  }

  get isContractualDispute() {
    return !this.employeeConsumer && this.tags.indexOf(ContractualDisputeTag) !== -1;
  }
}

export class Report {
  id: string;
  category: string;
  subcategories: Subcategory[];
  tags: Tag[];
  company: Company;
  website: Website;
  vendor: string;
  detailInputValues: DetailInputValue[];
  uploadedFiles: UploadedFile[];
  consumer: Consumer;
  employeeConsumer: boolean;
  contactAgreement: boolean;
  creationDate: Date;
  status: string;

  get consumerUploadedFiles() {
    return this.uploadedFiles ? this.uploadedFiles.filter(file => file.origin === FileOrigin.Consumer) : [];
  }
  get professionalUploadedFiles() {
    return this.uploadedFiles ? this.uploadedFiles.filter(file => file.origin === FileOrigin.Professional) : [];
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
