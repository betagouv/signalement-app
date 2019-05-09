export class ReportEvent {
  id: string;
  reportId: string;
  creationDate: Date;
  userId: string;
  eventType: string;
  action: string;
  resultAction: boolean;
  detail: string;
}
