import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceUtils {


  getUrl(urlParams) {
    return urlParams.reduce((acc, param) => `${acc}/${param}`, environment.apiBaseUrl);
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
