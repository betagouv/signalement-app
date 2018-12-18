import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceUtils {


  getUrl(api: Api, urlParams: string[]) {
    return urlParams.reduce((acc, param) => `${acc}/${param}`, environment[api]);
  }

  getHttpHeaders() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    };
  }

}


export enum Api {
  Signalement = 'apiSignalementBaseUrl',
  Adresse = 'apiAdresseBaseUrl'
}
