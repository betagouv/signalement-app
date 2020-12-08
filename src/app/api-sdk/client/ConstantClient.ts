import { ApiClient } from '../ApiClient';
import { Country } from '../model/Country';

export class ConstantClient {

  constructor(private client: ApiClient) {
  }

  readonly getCountries = () => this.client.get<Country[]>(`/constants/contry`);

  readonly getReportStatusList = () => this.client.get<string[]>(`/constants/reportStatus`);
}
