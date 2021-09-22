import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { throwError } from 'rxjs';

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(platformId)) {
      try {
        this.atTag = new ATInternet.Tracker.Tag();
      } catch (e) {
        console.error(`Unable to load AT internet.`, e);
      }
    }
  }

  private atTag?: any;

  readonly send = async (pageInfo: ATIPageInfo) => {
    try {
      await this.atTag?.page.send({ level2: 'Visitor', ...pageInfo });
    } catch (err) {
      const error = new Error(`[SignalConso] Failed to send data to AT Internet: ${err.message}`);
      error.name = err.name;
      return throwError(error);
    }
  };
}
