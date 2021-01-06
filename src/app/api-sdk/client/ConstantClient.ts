import { ApiClient } from '../ApiClient';

export class ConstantClient {

  constructor(private client: ApiClient) {
  }

  readonly getReportStatusList = () => this.client.get<string[]>(`/constants/reportStatus`);
}
