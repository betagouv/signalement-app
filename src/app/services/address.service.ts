import { Injectable } from '@angular/core';
import { CompleterItem, RemoteData } from 'ng2-completer';
import { HttpClient } from '@angular/common/http';
import { City } from '../model/City';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) {
  }

  getCityData() {
    return new CityData(this.http);
  }

  getAddressData(city: City | string) {
    return new AddressData(this.http, city);
  }
}

class CityData extends RemoteData {

  constructor(http: HttpClient) {
    super(http);
    this.remoteUrl('https://api-adresse.data.gouv.fr/search/?limit=20&type=municipality&q=');
    this.dataField('features');
    this.searchFields('properties.city');
  }

  public convertToItem(data: any): CompleterItem | null {
    return {
      title: data.properties.city,
      description: ` - ${data.properties.postcode}`,
      originalObject: data.properties,
    } as CompleterItem;
  }
}

class AddressData extends RemoteData {

  constructor(http: HttpClient, city: City | string) {
    super(http);
    let searchParam = 'limit=20&type=housenumber';
    if (city instanceof City) {
      searchParam = searchParam.concat(`&postcode=${city.postcode}&q=${city.name}+`);
    } else {
      searchParam = searchParam.concat(`&q=${city}+`);
    }
    this.remoteUrl(`https://api-adresse.data.gouv.fr/search/?${searchParam}`);
    this.dataField('features');
    this.searchFields('properties.name');
  }

  public convertToItem(data: any): CompleterItem | null {
    console.log('name', data.properties.name)
    return {
      title: data.properties.name,
      description: ` - ${data.properties.postcode} ${data.properties.city}`,
      originalObject: data.properties,
    } as CompleterItem;
  }
}
