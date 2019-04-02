import { Injectable } from '@angular/core';
import { CompleterItem, RemoteData } from 'ng2-completer';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private _addressData: AddressData;

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
    this._addressData = new AddressData(this.http, this.serviceUtils);
  }

  get addressData() {
    return this._addressData;
  }
}

class AddressData extends RemoteData {

  constructor(http: HttpClient, serviceUtils: ServiceUtils) {
    super(http);
    this.remoteUrl(serviceUtils.getUrl(Api.Address, ['search']).concat('?limit=20&q='));
    this.dataField('features');
    this.searchFields('properties.label');
  }

  public convertToItem(data: any): CompleterItem | null {
    return data ? {
      title: data.properties.label,
      originalObject: data.properties,
    } as CompleterItem : data;
  }
}
