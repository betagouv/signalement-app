import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { Roles } from '../../../model/AuthUser';


@Component({
  selector: 'app-websites-tabs',
  styleUrls: ['./websites-tabs.component.scss'],
  template: `
    <nav class="nav nav-tabs nav-justified" role="tablist" aria-label="Type de site internet">
      <button class="nav-item nav-link" *ngFor="let navTab of navTabs" [ngClass]="navTab === currentNavTab ? 'active' : ''" [routerLink]="navTab.link"
              role="tab" [attr.aria-selected]="navTab === currentNavTab" [attr.aria-controls]="currentNavTab.label + '-panel'" [id]="currentNavTab.label + '-tab'"
              [tabIndex]="navTab === currentNavTab ? 0 : -1"
              (keydown.arrowRight)="nextTab()" (keydown.arrowLeft)="previousTab()">
        {{navTab.label}}
      </button>
    </nav>
  `
})
export class WebsitesTabsComponent implements OnInit {

  manageTab = {link: ['/', 'moderation-url-entreprises'], label: 'Associations sites / entreprises'};
  unregisteredTab = {link: ['/', 'sites-internet', 'non-identifies'], label: 'Sites non identifiés'};

  navTabs: {link: string[], label: string}[];
  currentNavTab: {link: string[], label: string};

  constructor(private authenticationService: AuthenticationService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    combineLatest([this.route.url, this.authenticationService.user]).pipe(take(1))
      .subscribe(([url, user]) => {
        this.navTabs = {
          [Roles.Admin]: [this.manageTab, this.unregisteredTab],
          [Roles.DGCCRF]: [this.manageTab]
        }[user.role];
        this.currentNavTab = this.navTabs.find(tab =>
          tab.link.reduce((s1, s2) => `${s1}/${s2}`) === url.reduce((s, segment) => `${s}/${segment.toString()}`, '/' )
        );
        if (!this.currentNavTab) {
          this.currentNavTab = this.navTabs[0];
        }
      });
  }

  previousTab() {
    this.currentNavTab = this.navTabs[this.navTabs.indexOf(this.currentNavTab) - 1];
  }

  nextTab() {
    this.currentNavTab = this.navTabs[this.navTabs.indexOf(this.currentNavTab) + 1];
  }

}
