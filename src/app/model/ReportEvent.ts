export class ReportEvent {
  id: string;
  reportId: string;
  creationDate: Date;
  userId: string;
  eventType: string;
  action: ReportEventAction;
  details: {description: string} | ReportResponse;
}

export class ReportEventAction {
  value: string;
}

export enum EventActionValues {
  FirstVisit = 'Envoi du signalement',
  ReportResponse = 'Réponse du professionnel au signalement',
  PostalSend = 'Envoi d\'un courrier',
  EditConsumer = 'Modification du consommateur',
  EditCompany = 'Modification du commerçant',
  Comment = 'Ajout d\'un commentaire',
  Control = 'Contrôle effectué',
  ConsumerAttachments = 'Ajout de pièces jointes du consommateur',
  ProfessionalAttachments = 'Ajout de pièces jointes du professionnel'
}

export class ReportResponse {
  responseType: ReportResponseTypes;
  consumerDetails: string;
  dgccrfDetails: string;
  fileIds: string[];
}

export enum ReportResponseTypes {
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
  NotConcerned = 'NOT_CONCERNED'
}

export class ReviewOnReportResponse {
  positive: boolean;
  details: string;
}

export class ReportAction {
  actionType: ReportEventAction;
  details: string;
  fileIds: string[];
}
