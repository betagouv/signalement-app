import { WebsiteClient } from './client/WebsiteClient';
import { ConstantClient } from './client/ConstantClient';
import { ReportedPhoneClient } from './client/ReportedPhoneClient';
import { ApiClientApi } from './ApiClient';
import { SubscriptionClient } from './client/SubscriptionClient';
import { CompanyClient } from './client/CompanyClient';

export class ApiSecuredSdk {
  constructor(private client: ApiClientApi) {
  }

  readonly website = new WebsiteClient(this.client);
  readonly reportedPhone = new ReportedPhoneClient(this.client);
  readonly constant = new ConstantClient(this.client);
  readonly subscription = new SubscriptionClient(this.client);
  readonly company = new CompanyClient(this.client);
}
