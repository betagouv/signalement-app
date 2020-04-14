export interface Company {
  id: string;
  siret: string;
  creationDate: Date;
  name: string;
  address: string;
  postalCode: string;
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

export class Website {
  url: string;
}
