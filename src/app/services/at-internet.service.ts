import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthenticationService } from './authentication.service';
import { catchError, map, tap } from 'rxjs/operators';
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
    private authenticationService: AuthenticationService,
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

  readonly send = (pageInfo: ATIPageInfo) => this.authenticationService.getConnectedUser().pipe(
    tap(_ => this.atTag?.page.send({ level2: _?.role ?? 'Visitor', ...pageInfo })),
    catchError(err => throwError(`[SignalConso] Failed to send data to AT Internet for ${pageInfo.name}: ${err.name} - ${err.message}`))
  ).subscribe();
}
