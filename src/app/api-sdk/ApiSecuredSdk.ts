import { WebsiteClient } from './client/WebsiteClient';
import { ConstantClient } from './client/ConstantClient';
import { ApiClientApi } from './ApiClient';

export class ApiSecuredSdk {
  constructor(private client: ApiClientApi) {
  }

  readonly website = new WebsiteClient(this.client);
  readonly constant = new ConstantClient(this.client);
}
