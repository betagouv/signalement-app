import { Company } from './Company';

export enum WebsiteKind {
  DEFAULT = 'DEFAULT',
  MARKETPLACE = 'MARKETPLACE',
  PENDING = 'PENDING',
  EXCLUSIVE = 'EXCLUSIVE',
}

export interface Website {
  id: string;
  creationDate: Date;
  host: string;
  companyId: string;
  kind: WebsiteKind;
}

export interface WebsiteWithCompany extends Website {
  company: Company;
}
