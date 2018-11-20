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
      this.generateSignalementFormData(signalement)
    );
  }

  private generateSignalementFormData(signalement: Signalement) {

    const signalementFormData: FormData = new FormData();
    Object.keys(signalement)
      .filter(key => !(signalement[key] instanceof File))
      .forEach(key => {
        signalementFormData.append(key, signalement[key]);
      });
    if (signalement.photo) {
      signalementFormData.append('file', signalement.photo, signalement.photo.name);
    }

    return signalementFormData;
  }


}
