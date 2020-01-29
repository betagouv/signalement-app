import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoleDirective } from '../../directives/app-role.directive';
import { AppPermissionDirective } from '../../directives/app-permission.directive';
import { AccountMenuComponent } from './account-menu/account-menu.component';
import { AuthenticationService } from '../../services/authentication.service';
import { of } from 'rxjs';
import { User } from '../../model/AuthUser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let authenticationService: AuthenticationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        AppRoleDirective,
        AppPermissionDirective,
        AccountMenuComponent,
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
      ]
    })
    .compileComponents();
  }));


  describe('for a not authenticated user', () => {

    beforeEach(() => {
      authenticationService = TestBed.get(AuthenticationService);
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should display 2 menu items and an authentication button when no user is authenticated', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('.nav-item > .nav-link').length).toBe(3);
      expect(nativeElement.querySelector('.nav-item > button').textContent.trim()).toEqual('Espace pro');
    });
  });

  describe('for a DGCCRF user', () => {

    beforeEach(() => {
      authenticationService = TestBed.get(AuthenticationService);
      authenticationService.user = of(Object.assign(new User(), { role: 'DGCCRF' }));
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should display 3 menu items and an account button', () => {
      const nativeElement = fixture.nativeElement;

      expect(nativeElement.querySelectorAll('.nav-item > .nav-link').length).toBe(4);
      expect(nativeElement.querySelector('.nav-item button').textContent.trim()).toEqual('Compte');
    });
  });

  describe('for a professional user', () => {

    beforeEach(() => {
      authenticationService = TestBed.get(AuthenticationService);
      authenticationService.user = of(Object.assign(new User(), { role: 'Professionnel' }));
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should display 2 menu items and an account button', () => {
      const nativeElement = fixture.nativeElement;

      expect(nativeElement.querySelectorAll('.nav-item > .nav-link').length).toBe(3);
      expect(nativeElement.querySelector('.nav-item button').textContent.trim()).toEqual('Compte');
    });
  });

  describe('for an admin user', () => {

    beforeEach(() => {
      authenticationService = TestBed.get(AuthenticationService);
      authenticationService.user = of(Object.assign(new User(), { role: 'Admin' }));
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should display 2 menu items and an account button', () => {
      const nativeElement = fixture.nativeElement;

      expect(nativeElement.querySelectorAll('.nav-item > .nav-link').length).toBe(3);
      expect(nativeElement.querySelector('.nav-item button').textContent.trim()).toEqual('Compte');
    });
  });

});
