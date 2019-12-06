import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Title, Meta } from "@angular/platform-browser";
import pages from '../../../../assets/data/pages.json';
import { AuthenticationService } from '../../../services/authentication.service';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { UserAccess } from "../../../model/CompanyAccess";
import { User } from "../../../model/AuthUser.js";

@Component({
  selector: 'app-my-companies',
  templateUrl: './mycompanies.component.html'
})
export class MyCompaniesComponent implements OnInit {

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
    this.authenticationService.user.subscribe(user => {
      this.user = user;
      this.refreshAccesses();
    });
  }
  refreshAccesses() {
    this.companyAccessesService.myAccesses(this.user).subscribe(
      accesses => {
        this.myAccesses = accesses;
      }
    )
  }
}
