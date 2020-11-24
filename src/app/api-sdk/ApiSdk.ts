import { WebsiteClient } from './client/WebsiteClient';
import { ApiClient } from './ApiClient';

export class ApiSdk {
  constructor(private client: ApiClient) {
  }

  readonly website = new WebsiteClient(this.client);
}
