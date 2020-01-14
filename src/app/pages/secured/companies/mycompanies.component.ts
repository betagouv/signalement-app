import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Title, Meta } from "@angular/platform-browser";
import pages from '../../../../assets/data/pages.json';
import { AuthenticationService } from '../../../services/authentication.service';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { UserAccess } from "../../../model/CompanyAccess";
import { User } from "../../../model/AuthUser.js";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: 'app-my-companies',
  templateUrl: './mycompanies.component.html'
})
export class MyCompaniesComponent implements OnInit {

  private unsubscribe = new Subject<void>();

  constructor(private titleService: Title,
              private meta: Meta,
              private router: Router,
              private authenticationService: AuthenticationService,
              private companyAccessesService: CompanyAccessesService) { }
    
              myAccesses: UserAccess[];
              user: User;

  ngOnInit() {
    this.titleService.setTitle(pages.secured.myCompanies.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.myCompanies.description });
    this.authenticationService.user
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
    this.companyAccessesService.myAccesses(this.user).subscribe(
      accesses => {
        this.myAccesses = accesses;
      }
    )
  }
}
