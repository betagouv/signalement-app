import { Id } from '../model/Common';
import { ApiClientApi } from '../ApiClient';
import { ApiSubscription, ApiSubscriptionCreate } from '../model/ApiSubscription';
import { Department } from '../../model/Region';

const fromApi = (api: any): ApiSubscription => ({
  ...api,
  departments: api.departments.map(Department.fromCode),
});

const toApi = (subscription: Partial<ApiSubscription>): any => ({
  ...subscription,
  departments: subscription.departments?.map(_ => _.code),
});

export class SubscriptionClient {

  constructor(private client: ApiClientApi) {
  }

  readonly list = (): Promise<ApiSubscription[]> => {
    return this.client.get<ApiSubscription[]>(`/subscriptions`).then(_ => _.map(fromApi));
  };

  readonly get = (id: Id) => {
    return this.client.get<ApiSubscription>(`/subscriptions/${id}`).then(fromApi);
  };

  readonly create = (body: ApiSubscriptionCreate) => {
    return this.client.post<ApiSubscription>(`/subscriptions`, { body: toApi(body) }).then(fromApi);
  };

  readonly update = (id: Id, body: Partial<ApiSubscription>) => {
    return this.client.put<ApiSubscription>(`/subscriptions/${id}`, { body: toApi(body) }).then(fromApi);
  };

  readonly remove = (id: Id) => {
    return this.client.delete<void>(`/subscriptions/${id}`);
  };
}
