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

  readonly list = (): Promise<ApiReportedPhoneWithCompany[]> => {
    return this.client.get<ApiReportedPhoneWithCompany[]>(`/reported-phones`);
  };

  readonly listUnregistered = (q?: string, start?: string, end?: string): Promise<ApiPhoneWithReportCount[]> => {
    return this.client.get<ApiPhoneWithReportCount[]>(`/reported-phones/unregistered`, { qs: { q, start, end } });
  };

  readonly extractUnregistered = (q?: string, start?: string, end?: string): Promise<ApiPhoneWithReportCount[]> => {
    return this.client.get<ApiPhoneWithReportCount[]>(`/reported-phones/unregistered/extract`, { qs: { q, start, end } });
  };

  readonly update = (id: Id, reportedPhone: Partial<ApiReportedPhone>): Promise<ApiReportedPhoneWithCompany> => {
    return this.client.put<ApiReportedPhoneWithCompany>(`/reported-phones/${id}`, { body: reportedPhone });
  };

  readonly updateCompany = (id: Id, reportedPhone: ApiReportedPhoneUpdateCompany): Promise<ApiReportedPhoneWithCompany> => {
    return this.client.put<ApiReportedPhoneWithCompany>(`/reported-phones/${id}/company`, { body: reportedPhone });
  };

  readonly remove = (id: Id): Promise<void> => {
    return this.client.delete<void>(`/reported-phones/${id}`);
  };
}
