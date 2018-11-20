import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceUtils } from './service.utils';
import { Signalement } from '../model/Signalement';
import * as moment from 'moment';

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
      this.generateSignalementFormData(signalement)
    );
  }

  private generateSignalementFormData(signalement: Signalement) {

    const signalementFormData: FormData = new FormData();
    Object.keys(signalement)
      .filter(key => !(signalement[key] instanceof File))
      .forEach(key => {
        const data = signalement[key];
        if (data instanceof Date) {
          signalementFormData.append(key, moment(data).format('YYYY-MM-DD'));
        } else {
          signalementFormData.append(key, data);
        }
      });
    if (signalement.photo) {
      signalementFormData.append('file', signalement.photo, signalement.photo.name);
    }

    return signalementFormData;
  }


}
