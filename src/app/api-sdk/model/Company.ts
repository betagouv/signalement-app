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

export interface ApiCompany extends ApiDraftCompany {
  id: string;
  creationDate: string;
}

export interface ApiCompanyToActivate {
  company: ApiCompany;
  lastNotice?: string;
  tokenCreation: string;
}
