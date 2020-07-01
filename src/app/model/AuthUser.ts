export class User {

  id: string;
  login: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: Permissions[];

  get roleUrlParam() {
    switch (this.role) {
      case Roles.Admin: return 'admin';
      case Roles.DGCCRF: return 'dgccrf';
      case Roles.Pro: return 'pro';
      default: return '';
    }
  }
}

export class AuthUser {
  token: string;
  user: User;
}

export enum TokenKind {
  companyInit = 'COMPANY_INIT',
  companyJoin = 'COMPANY_JOIN',
  dgccrfAccount = 'DGCCRF_ACCOUNT',
}

export class TokenInfo {
  token: string;
  kind: TokenKind;
  timestamp: Date;
  companySiret?: string;
  emailedTo?: string;
}

export enum Permissions {
  listReports = 'listReports',
  updateReport = 'updateReport',
  deleteReport = 'deleteReport',
  deleteFile = 'deleteFile',
  createEvent = 'createEvent',
  editDocuments = 'editDocuments',
  subscribeReports = 'subscribeReports',
  updateCompany = 'updateCompany'
}

export enum Roles {
  Admin = 'Admin',
  DGCCRF = 'DGCCRF',
  Pro = 'Professionnel',
  ToActivate = 'ToActivate'
}
