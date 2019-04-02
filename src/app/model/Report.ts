import { Consumer } from './Consumer';
import { Company } from './Company';
import { Subcategory } from './Anomaly';
import { Step } from '../services/report-router.service';
import { UploadedFile } from './UploadedFile';

export class Report {

  category: string;
  subcategories: Subcategory[];
  company: Company;
  details: ReportDetails;
  consumer: Consumer;
  contactAgreement: boolean;
  internetPurchase: boolean;
  retrievedFromStorage: boolean;
  storedStep: Step;

  get lastSubcategory() {
    if (this.subcategories && this.subcategories.length) {
      return this.subcategories[this.subcategories.length - 1];
    }
  }

}

export class ReportDetails {

  anomalyDate: Date;
  anomalyTimeSlot: number;
  description: string;
  precision?: string | string[];
  otherPrecision?: string;
  uploadedFiles: UploadedFile[];

}
