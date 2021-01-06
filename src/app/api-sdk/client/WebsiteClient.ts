import { ApiHostWithReportCount, ApiWebsite, ApiWebsiteCreate, ApiWebsiteUpdateCompany, ApiWebsiteWithCompany } from '../model/ApiWebsite';
import { Id } from '../model/Common';
import { ApiClient } from '../ApiClient';

export class WebsiteClient {

  constructor(private client: ApiClient) {
  }

  readonly list = (): Promise<ApiWebsiteWithCompany[]> => {
    return this.client.get<ApiWebsiteWithCompany[]>(`/websites`);
  };

  readonly listUnregistered = (q?: string, start?: string, end?: string): Promise<ApiHostWithReportCount[]> => {
    return this.client.get<ApiHostWithReportCount[]>(`/websites/unregistered`, { qs: { q, start, end } });
  };

  readonly extractUnregistered = (q?: string, start?: string, end?: string): Promise<ApiHostWithReportCount[]> => {
    return this.client.get<ApiHostWithReportCount[]>(`/websites/unregistered/extract`, { qs: { q, start, end } });
  };

  readonly update = (id: Id, website: Partial<ApiWebsite>): Promise<ApiWebsiteWithCompany> => {
    return this.client.put<ApiWebsiteWithCompany>(`/websites/${id}`, { body: website });
  };

  readonly updateCompany = (id: Id, website: ApiWebsiteUpdateCompany): Promise<ApiWebsiteWithCompany> => {
    return this.client.put<ApiWebsiteWithCompany>(`/websites/${id}/company`, { body: website });
  };

  readonly remove = (id: Id): Promise<void> => {
    return this.client.delete<void>(`/websites/${id}`);
  };
}
