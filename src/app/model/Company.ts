import { ApiWebsiteKind } from '../api-sdk/model/ApiWebsite';
import { Id } from '../api-sdk/model/Common';

export interface CompanyUpdate {
  address: string;
  postalCode: string;
  activationDocumentRequired: boolean;
}

export interface CompanyCreation {
  siret: string;
  name: string;
  address: string;
  postalCode?: string;
  activityCode?: string;
}

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

export interface Company {
  id: Id;
  siret: string;
  creationDate: Date;
  name: string;
  address: string;
  postalCode?: string;
  activityCode?: string;
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

export enum AccessLevel {
  NONE = 'none',
  MEMBER = 'member',
  ADMIN = 'admin',
}

export interface CompanyAccessLevel extends Company {
  level: AccessLevel;
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

export interface WebsiteURL {
  url: string;
}

export const isGovernmentCompany = (_?: DraftCompany): boolean => _?.activityCode?.startsWith('84.') ?? false;
