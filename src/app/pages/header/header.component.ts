import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

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

  @ViewChild('navbarContent') navbarContent: ElementRef<any>;

  navItems = NavItems;
  activeItem: NavItems;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.activeItem = NavItems[Object.keys(NavItems).find(key => encodeURI(NavItems[key]) === event.url)];
      }
    });
  }

  getNavItemDataToggle() {
    return (this.navbarContent && this.navbarContent.nativeElement.classList.contains('show')) ? 'collapse' : '';
  }
}
