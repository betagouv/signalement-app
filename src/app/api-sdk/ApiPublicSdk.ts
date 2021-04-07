import { Country } from './model/Country';
import { ApiClientApi } from './ApiClient';
import { PublicCompanyClient } from './client/PublicCompanyClient';

export class ApiPublicSdk {

  constructor(private client: ApiClientApi) {
  }

  readonly company = new PublicCompanyClient(this.client);
  readonly getCountries = () => this.client.get<Country[]>(`/constants/countries`);
}
