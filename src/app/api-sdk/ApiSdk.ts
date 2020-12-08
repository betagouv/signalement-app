import { WebsiteClient } from './client/WebsiteClient';
import { ApiClient } from './ApiClient';
import { ConstantClient } from './client/ConstantClient';

export class ApiSdk {
  constructor(private client: ApiClient) {
  }

  readonly website = new WebsiteClient(this.client);
  readonly constant = new ConstantClient(this.client);
}
