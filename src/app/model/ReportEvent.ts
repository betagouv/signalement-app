export class ReportEvent {
  id: string;
  reportId: string;
  creationDate: Date;
  userId: string;
  eventType: string;
  action: ReportEventAction;
  resultAction: boolean;
  detail: string;
}

export class ReportEventAction {
  name: string;
  withResult: boolean;
}
