import { Injectable } from '@angular/core';
import { CRUDListService } from './helper/CRUDListService';
import { Subscription } from '../api-sdk/model/Subscription';
import { ApiSdkService } from './core/api-sdk.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService extends CRUDListService<Subscription> {

  constructor(protected api: ApiSdkService) {
    super(api, api.secured.subscription);
  }
}
