import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceUtils } from './service.utils';
import { Signalement } from '../model/Signalement';

@Injectable({
  providedIn: 'root'
})
export class SignalementService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  createSignalement(signalement: Signalement) {

    return this.http.post(
      this.serviceUtils.getUrl(['api', 'signalement']),
      JSON.stringify(signalement),
      this.serviceUtils.getHttpHeaders()
    );
  }


}
