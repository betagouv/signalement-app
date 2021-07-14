import { ApiClientApi } from '../ApiClient';
import { CompanySearchResult } from '../../model/Company';

export class PublicCompanyClient {

  constructor(private client: ApiClientApi) {
  }

  readonly searchCompanies = (search: string, searchPostalCode: string) => {
    return this.client.get<CompanySearchResult[]>(`/companies/search`, {
      qs: {
        postalCode: searchPostalCode.toString(),
        q: search,
      }
    });
  };

  readonly searchCompaniesByIdentity = (identity: string) => {
    return this.client.get<CompanySearchResult[]>(`/companies/search/${identity}`, {})
      .then(companies => companies.filter(_ => _.address.postalCode));
  };

  readonly searchCompaniesByUrl = (url: string) => {
    return this.client.get<CompanySearchResult[]>(`/companies/search-url`, { qs: { url } });
  };
}
