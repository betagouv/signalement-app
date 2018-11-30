import { Injectable } from '@angular/core';
import { CompleterItem, RemoteData } from 'ng2-completer';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityDataService extends RemoteData {

  constructor(http: HttpClient) {
    super(http);
    this.remoteUrl('https://api-adresse.data.gouv.fr/search/?limit=20&type=municipality&q=');
    this.dataField('features');
    this.searchFields('properties.city');
  }

  public convertToItem(data: any): CompleterItem | null {
    return {
      title: data ? `${data.properties.city} (${data.properties.postcode})` : '',
    } as CompleterItem;
  }
}
