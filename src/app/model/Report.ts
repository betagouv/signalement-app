import { Consumer } from './Consumer';
import { Company } from './Company';

export class Report {

  anomalyCategory: string;
  anomalyPrecision: string;
  company: Company;
  details: ReportDetails;
  consumer: Consumer;
  contactAgreement: boolean;

}

export class ReportDetails {

  anomalyDate: Date;
  anomalyTimeSlot: number;
  description: string;
  ticketFile: File;
  anomalyFile: File;

}
