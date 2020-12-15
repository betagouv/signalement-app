import { ApiClient } from '../ApiClient';
import { Country } from '../model/Country';

export class ConstantClient {

  constructor(private client: ApiClient) {
  }

  readonly getReportStatusList = () => this.client.get<string[]>(`/constants/reportStatus`);
}
