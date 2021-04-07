import { Id } from './Common';

export interface ApiWebsiteURL {
  url: string;
}

export interface ApiDraftCompany {
  siret?: string;
  name?: string;
  brand?: string;
  address?: string;
  postalCode?: string;
  country?: string;
  website?: ApiWebsiteURL;
  activityCode?: string;
}

export interface ApiCompany {
  id: Id;
  siret: string;
  creationDate: string;
  name: string;
  address: string;
  postalCode?: string;
  activityCode?: string;
}

export interface ApiCompanyToActivate {
  company: ApiCompany;
  lastNotice?: string;
  tokenCreation: string;
}
