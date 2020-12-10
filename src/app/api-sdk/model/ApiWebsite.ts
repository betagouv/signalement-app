import { Company } from '../../model/Company';
import { Id } from './Common';

export enum ApiWebsiteKind {
  DEFAULT = 'DEFAULT',
  MARKETPLACE = 'MARKETPLACE',
  PENDING = 'PENDING',
  EXCLUSIVE = 'EXCLUSIVE',
}

export interface ApiWebsite {
  id: Id;
  creationDate: Date;
  host: string;
  companyId: Id;
  kind: ApiWebsiteKind;
}

export interface ApiWebsiteUpdateCompany {
  companySiret: string;
  companyName: string;
  companyAddress?: string;
  companyPostalCode?: string;
  companyActivityCode?: string;
}

export interface ApiWebsiteCreate extends ApiWebsiteUpdateCompany {
  host: string;
}

export interface ApiWebsiteWithCompany extends ApiWebsite {
  company: Company;
}