import { Injectable } from '@angular/core';
import { CRUDListService } from './helper/CRUDListService';
import { ApiSubscription, ApiSubscriptionCreate } from '../api-sdk/model/ApiSubscription';
import { ApiSdkService } from './core/api-sdk.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService extends CRUDListService<ApiSubscription, ApiSubscriptionCreate> {

  constructor(protected api: ApiSdkService) {
    super(api, api.secured.subscription);
  }
}
