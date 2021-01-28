import {
  ApiPhoneWithReportCount,
  ApiReportedPhone,
  ApiReportedPhoneUpdateCompany,
  ApiReportedPhoneWithCompany,
} from '../model/ApiReportedPhone';
import { Id } from '../model/Common';
import { ApiClient } from '../ApiClient';

export class ReportedPhoneClient {

  constructor(private client: ApiClient) {
  }

  readonly list = (q?: string, start?: string, end?: string): Promise<ApiPhoneWithReportCount[]> => {
    return this.client.get<ApiPhoneWithReportCount[]>(`/reported-phones`, { qs: { q, start, end } });
  };

  readonly extract = (q?: string, start?: string, end?: string): Promise<ApiPhoneWithReportCount[]> => {
    return this.client.get<ApiPhoneWithReportCount[]>(`/reported-phones/extract`, { qs: { q, start, end } });
  };
}
