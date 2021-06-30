import { Id } from './Common';
import { Address } from '../../model/Address';

export interface ApiWebsiteURL {
  url: string;
}

export interface ApiDraftCompany {
  siret?: string;
  name?: string;
  brand?: string;
  address?: Address;
  website?: ApiWebsiteURL;
  activityCode?: string;
}

export interface ApiCompany {
  id: Id;
  siret: string;
  creationDate: string;
  name: string;
  address: Address;
  activityCode?: string;
}

export interface ApiCompanyToActivate {
  company: ApiCompany;
  lastNotice?: string;
  tokenCreation: string;
}
