import { ApiClientApi } from '../ApiClient';
import { ReportStatus } from '../../model/Report';

export class ConstantClient {

  constructor(private client: ApiClientApi) {
  }

  readonly getReportStatusList = () => this.client.get<ReportStatus[]>(`/constants/reportStatus`);
}
