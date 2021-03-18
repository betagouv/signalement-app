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
    this.atTag = new ATInternet.Tracker.Tag();
  }

  private atTag: any;

  readonly send = (pageInfo: ATIPageInfo) => {
    this.atTag.page.send(pageInfo);
  };
}
