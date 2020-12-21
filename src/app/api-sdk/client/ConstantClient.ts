import { ApiClient } from '../ApiClient';
import { ReportStatus } from '../../model/Report';

export class ConstantClient {

  constructor(private client: ApiClient) {
  }

  readonly getReportStatusList = () => this.client.get<ReportStatus[]>(`/constants/reportStatus`);
}
