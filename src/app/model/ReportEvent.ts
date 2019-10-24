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
  name: string;
  withResult: boolean;
}

export enum EventActions {
  FirstVisitEventAction = 'Envoi du signalement',
  ProAnswerReportEventAction = 'Réponse du professionnel au signalement'
}

export class ReportResponse {
  responseType: ReportResponseTypes;
  consumerDetails: string;
  dgccrfDetails: string;
}


export enum ReportResponseTypes {
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
  NotConcerned = 'NOT_CONCERNED'
}
