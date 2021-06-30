import { Company } from '../../model/Company';
import { Entity, Id } from './Common';
import { Address } from '../../model/Address';

export enum ApiWebsiteKind {
  DEFAULT = 'DEFAULT',
  MARKETPLACE = 'MARKETPLACE',
  PENDING = 'PENDING'
}

export interface ApiWebsite extends Entity {
  creationDate: Date;
  host: string;
  companyId: Id;
  kind: ApiWebsiteKind;
}

export interface ApiWebsiteUpdateCompany {
  companySiret: string;
  companyName: string;
  companyAddress?: Address;
  companyActivityCode?: string;
}

export interface ApiWebsiteCreate extends ApiWebsiteUpdateCompany {
  host: string;
}

export interface ApiWebsiteWithCompany extends ApiWebsite {
  company: Company;
  count?: 0;
}

export interface ApiHostWithReportCount {
  host: string;
  count: number;
}
