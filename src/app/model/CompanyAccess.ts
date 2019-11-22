export interface CompanyAccess {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  level: string;
}

export interface PendingToken {
  id: string;
  level: string;
  emailedTo: string;
  expirationDate: Date;
}
