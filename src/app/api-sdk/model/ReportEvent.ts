
export class Event {
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
