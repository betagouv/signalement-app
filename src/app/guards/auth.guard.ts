import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    @Inject(PLATFORM_ID) protected platformId: Object,
    private authenticationService: AuthenticationService,
    private router: Router) { }

  canActivate() {
    return this.authenticationService.isAuthenticated()
      .pipe(
        map(isAuthenticated => {
          if (!isAuthenticated && isPlatformBrowser(this.platformId)) {
            this.router.navigate(['connexion']);
          }
          return isAuthenticated;
        })
      );
  }
}
