import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private localStorage: LocalStorage) { }

  setLocalStorageItem(key: string, data: any) {
    this.localStorage.setItemSubscribe(key, data);
  }

  getLocalStorageItem(key: string) {
    return this.localStorage.getItem(key);
  }

  setSessionItem(key: string, data: any) {
    of(sessionStorage.setItem(key, data));
  }

  getSessionItem(key: string) {
    return of(sessionStorage.getItem(key));
  }

}
