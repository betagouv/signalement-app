import { Injectable } from '@angular/core';
import { CompleterItem, RemoteData } from 'ng2-completer';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private _addressData: AddressData;

  constructor(private http: HttpClient) {
    this._addressData = new AddressData(this.http);
  }

  get addressData() {
    return this._addressData;
  }
}

class AddressData extends RemoteData {

  constructor(http: HttpClient) {
    super(http);
    this.remoteUrl(`https://api-adresse.data.gouv.fr/search/?limit=20&q=`);
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
