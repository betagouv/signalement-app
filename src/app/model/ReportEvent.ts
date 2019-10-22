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

export const ProAnswerReportEventAction = Object.assign(new ReportEventAction(), {
  name: 'Réponse du professionnel au signalement',
  withResult: true
});

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
