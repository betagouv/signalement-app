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

export interface Company {
  id: string;
  siret: string;
  creationDate: Date;
  name: String;
  address: String;
}

export interface CompanyToActivate {
  company: Company;
  lastNotice: Date;
  tokenCreation: Date;
}
