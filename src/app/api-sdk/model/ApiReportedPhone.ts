import { Company } from '../../model/Company';
import { Entity, Id } from './Common';

export enum ApiReportedPhoneStatus {
  VALIDATED = 'VALIDATED',
  PENDING = 'PENDING'
}

export interface ApiReportedPhone extends Entity {
  creationDate: Date;
  phone: string;
  companyId: Id;
  status: ApiReportedPhoneStatus;
}

export interface ApiReportedPhoneUpdateCompany {
  companySiret: string;
  companyName: string;
  companyAddress?: string;
  companyPostalCode?: string;
  companyActivityCode?: string;
}

export interface ApiReportedPhoneCreate extends ApiReportedPhoneUpdateCompany {
  phone: string;
}

export interface ApiReportedPhoneWithCompany extends ApiReportedPhone {
  company: Company;
  count?: 0;
}

export interface ApiPhoneWithReportCount {
  phone: string;
  count: number;
}
