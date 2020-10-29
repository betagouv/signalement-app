import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    @Inject(PLATFORM_ID) protected platformId: Object,
    private authenticationService: AuthenticationService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.authenticationService.isAuthenticated()
      .pipe(
        tap(isAuthenticated => {
          if (!isAuthenticated) {
            this.router.navigate(['connexion']);
          }
        }),
        switchMap( _ => this.authenticationService.user),
        map(user => {
          if (route.data.expectedRoles && route.data.expectedRoles.indexOf(user.role) === -1) {
            this.router.navigate(['not-found']);
          }
          return true;
        })
      );
  }
}
