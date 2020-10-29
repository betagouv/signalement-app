import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { AuthenticationService } from '../../../services/authentication.service';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { UserAccess } from '../../../model/Company';
import { User } from '../../../model/AuthUser.js';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-my-companies',
  templateUrl: './my-companies.component.html',
  styleUrls: ['./my-companies.component.scss']
})
export class MyCompaniesComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject<void>();

  myAccesses: UserAccess[];
  user: User;
  loading: boolean;

  constructor(private titleService: Title,
              private meta: Meta,
              private router: Router,
              private authenticationService: AuthenticationService,
              private companyAccessesService: CompanyAccessesService) { }

  ngOnInit() {
    this.titleService.setTitle(pages.companies.myCompanies.title);
    this.meta.updateTag({ name: 'description', content: pages.companies.myCompanies.description });
    this.authenticationService.getUser()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(user => {
      this.user = user;
      this.refreshAccesses();
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  refreshAccesses() {
    this.loading = true;
    this.companyAccessesService.myAccesses(this.user).subscribe(
      accesses => {
        this.loading = false;
        this.myAccesses = accesses;
      }
    );
  }
}
