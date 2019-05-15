import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router) { }

  canActivate() {
    return this.authenticationService.isAuthenticated()
      .pipe(
        map(isAuthenticated => {
          if (!isAuthenticated) {
            this.router.navigate(['login']);
          }
          return isAuthenticated;
        })
      );
  }
}
