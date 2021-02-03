import { Country } from './model/Country';
import { ApiClientApi } from './ApiClient';

export class ApiPublicSdk {

  constructor(private client: ApiClientApi) {
  }

  readonly getCountries = () => this.client.get<Country[]>(`/constants/countries`);
}
