import { Id } from '../model/Common';
import { ApiClientApi } from '../ApiClient';
import { Subscription } from '../model/Subscription';
import { Department } from '../../model/Region';

const fromApi = (api: any): Subscription => ({
  ...api,
  departments: api.departments.map(Department.fromCode),
});

const toApi = (subscription: Partial<Subscription>): any => ({
  ...subscription,
  departments: subscription.departments.map(_ => _.code),
});

export class SubscriptionClient {

  constructor(private client: ApiClientApi) {
  }

  readonly list = (): Promise<Subscription[]> => {
    return this.client.get<Subscription[]>(`/subscriptions`).then(_ => _.map(fromApi));
  };

  readonly get = (id: Id) => {
    return this.client.get<Subscription>(`/subscriptions/${id}`).then(fromApi);
  };

  readonly create = (body: Subscription) => {
    return this.client.put<Subscription>(`/subscriptions`, { body: toApi(body) }).then(fromApi);
  };

  readonly update = (id: Id, body: Partial<Subscription>) => {
    return this.client.put<Subscription>(`/subscriptions/${id}`, { body: toApi(body) }).then(fromApi);
  };

  readonly remove = (id: Id) => {
    return this.client.delete<void>(`/subscriptions/${id}`);
  };
}
