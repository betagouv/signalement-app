import { WebsiteClient } from './client/WebsiteClient';
import { ApiClient } from './ApiClient';
import { ConstantClient } from './client/ConstantClient';
import { ReportedPhoneClient } from './client/ReportedPhoneClient';

export class ApiSdkSecured {
  constructor(private client: ApiClient) {
  }

  readonly website = new WebsiteClient(this.client);
  readonly reportedPhone = new ReportedPhoneClient(this.client);
  readonly constant = new ConstantClient(this.client);
}
