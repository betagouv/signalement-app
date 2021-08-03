import { ApiHostWithReportCount, ApiWebsite, ApiWebsiteUpdateCompany, ApiWebsiteWithCompany } from '../model/ApiWebsite';
import { Id } from '../model/Common';
import { ApiClientApi } from '../ApiClient';
import {PaginatedData} from "../../model/PaginatedData";

export class WebsiteClient {

  constructor(private client: ApiClientApi) {
  }

  readonly list = (): Promise<ApiWebsiteWithCompany[]> => {
    return this.client.get<PaginatedData<ApiWebsiteWithCompany>>(`/websites`)
      .then(paginated => paginated.entities);
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
