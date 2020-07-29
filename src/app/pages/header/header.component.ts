import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Permissions, Roles, User } from '../../model/AuthUser';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

enum NavItems {
  Home = '/',
  How = '/comment-ça-marche',
  HowDGCCRF = '/mode-emploi-dgccrf',
  FaqConso = '/centre-aide/consommateur',
  FaqPro = '/centre-aide/professionnel',
  About = '/qui-sommes-nous',
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('banner', {static: false}) banner;
  @ViewChild('navbarContent', {static: false}) navbarContent: ElementRef<any>;

  roles = Roles;
  permissions = Permissions;
  user: User;

  navItems = NavItems;
  activeItem: NavItems;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
    this.authenticationService.user.subscribe(user => {
      this.user = user;
    });

    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.banner.nativeElement.focus();
      }
      if (event instanceof NavigationEnd) {
        this.activeItem = NavItems[Object.keys(NavItems).find(key => encodeURI(NavItems[key]) === event.url)];
      }
    });
  }

  getNavItemDataToggle() {
    return (this.navbarContent && this.navbarContent.nativeElement.classList.contains('show')) ? 'collapse' : '';
  }

}
