import { Consumer } from './Consumer';

export class Report {

  companyType: string;
  anomalyCategory: string;
  anomalyPrecision: string;
  companyName: string;
  companyAddress: string;
  companyPostalCode: string;
  companySiret: string;
  details: ReportDetails;
  consumer: Consumer;
  contactAgreement: boolean;
  ticketFile: File;
  anomalyFile: File;

}

export class ReportDetails {

  anomalyDate: Date;
  anomalyTimeSlot: number;
  description: string;

}
