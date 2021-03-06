import { ApiWebsiteKind } from '../api-sdk/model/ApiWebsite';

export interface DraftCompany {
  siret?: string;
  name?: string;
  brand?: string;
  address?: string;
  postalCode?: string;
  country?: string;
  website?: WebsiteURL;
  phone?: string;
  activityCode?: string;
}

export interface Company extends DraftCompany {
  id: string;
  creationDate: Date;
}

export interface CompanySearchResult extends DraftCompany {
  highlight: string;
  activityCode: string;
  activityLabel: string;
  isHeadOffice: boolean;
  kind?: ApiWebsiteKind;
}

export interface CompanyAccess {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  level: string;
}

export interface UserAccess {
  companySiret: string;
  companyName: string;
  companyAddress: string;
  level: string;
}

export interface ViewableCompany {
  siret: string;
  postalCode?: string;
  closed: boolean;
}

export interface PendingToken {
  id: string;
  level: string;
  emailedTo: string;
  expirationDate: Date;
}

export interface CompanyToActivate {
  company: Company;
  lastNotice: Date;
  tokenCreation: Date;
}

export class WebsiteURL {
  url: string;

  get hostname() {
    return this.url ? this.url
      .replace('http://', '')
      .replace('https://', '')
      .replace('www.', '')
      .split(/[/?#]/)[0] : this.url;
  }
}

export const isGovernmentCompany = (_?: DraftCompany): boolean => _.activityCode?.startsWith('84.');
