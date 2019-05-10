import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private localStorage: LocalStorage) { }

  setItem(key: string, data: any) {
    this.localStorage.setItemSubscribe(key, data);
  }

  getItem(key: string) {
    return this.localStorage.getItem(key);
  }

}
