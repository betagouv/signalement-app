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
  @ViewChild('cookiesBanner') cookiesBanner: ElementRef<any>;

  navItems = NavItems;
  activeItem: NavItems;
  showCNILBanner: boolean;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.activeItem = NavItems[Object.keys(NavItems).find(key => encodeURI(NavItems[key]) === event.url)];
      }
      this.showCNILBanner = localStorage.getItem('hideCNILBanner') !== 'true';
    });
  }

  getNavItemDataToggle() {
    return (this.navbarContent && this.navbarContent.nativeElement.classList.contains('show')) ? 'collapse' : '';
  }


  getCNILBannerStatus() {
    localStorage.getItem('hideCNILBanner') !== "false"
  }

  setHideCNILBanner() {
    console.log("------------------1--------");
    console.log(localStorage.getItem('hideCNILBanner'));
    localStorage.setItem('hideCNILBanner', "true");
    console.log("----------------2-----------");
    console.log(localStorage.getItem('hideCNILBanner'));
    this.cookiesBanner.nativeElement.hidden = true
  }
}
