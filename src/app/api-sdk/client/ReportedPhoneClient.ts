import { ApiPhoneWithReportCount } from '../model/ApiReportedPhone';
import { ApiClient, ApiClientApi } from '../ApiClient';

export class ReportedPhoneClient {

  constructor(private client: ApiClientApi) {
  }

  readonly list = (q?: string, start?: string, end?: string): Promise<ApiPhoneWithReportCount[]> => {
    return this.client.get<ApiPhoneWithReportCount[]>(`/reported-phones`, { qs: { q, start, end } });
  };

  readonly extract = (q?: string, start?: string, end?: string): Promise<ApiPhoneWithReportCount[]> => {
    return this.client.get<ApiPhoneWithReportCount[]>(`/reported-phones/extract`, { qs: { q, start, end } });
  };
}