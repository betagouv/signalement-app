import { ApiClient } from './ApiClient';
import { Country } from './model/Country';

export class ApiSdk {

  constructor(private client: ApiClient) {
  }

  readonly getCountries = () => this.client.get<Country[]>(`/constants/countries`);
}
