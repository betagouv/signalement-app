import { Injectable } from '@angular/core';

declare const ATInternet: any;

export interface ATIPageInfo {
  name: string;
  level2?: string;
  chapter1?: string;
  chapter2?: string;
  chapter3?: string;
  customObject?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AtInternetService {

  constructor() {
    try {
      this.atTag = new ATInternet.Tracker.Tag();
    } catch (e) {
      console.error(`Unable to load AT internet.`, e);
    }
  }

  private atTag?: any;

  readonly send = (pageInfo: ATIPageInfo) => {
    this.atTag?.page.send(pageInfo);
  };
}
