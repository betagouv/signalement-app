import { ApiClientApi } from '../ApiClient';
import { ReportedPhone } from '../../model/ReportedPhone';

export class ReportedPhoneClient {

  constructor(private client: ApiClientApi) {
  }

  readonly list = (q?: string, start?: string, end?: string) => {
    return this.client.get<ReportedPhone[]>(`/reported-phones`, { qs: { q, start, end } });
  };

  readonly extract = (q?: string, start?: string, end?: string) => {
    return this.client.get<ReportedPhone[]>(`/reported-phones/extract`, { qs: { q, start, end } });
  };
}
