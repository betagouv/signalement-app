export class User {

  id: string;
  login: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: Permissions[];

}

export class AuthUser {
  token: string;
  user: User;
}

export enum Permissions {
  listReports = 'listReports',
  updateReport = 'updateReport',
  deleteReport = 'deleteReport',
  deleteFile = 'deleteFile',
  createEvent = 'createEvent',
  editDocuments = 'editDocuments'
}

export enum Roles {
  Admin = 'Admin',
  DGCCRF = 'DGCCRF',
  Pro = 'Professionnel',
  ToActivate = 'ToActivate'
}
