import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Permissions, Roles, User } from '../../model/AuthUser';
import { Router, Scroll } from '@angular/router';

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

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
    this.authenticationService.user.subscribe(user => {
      this.user = user;
    });

    this.router.events.forEach((event) => {
      if (event instanceof Scroll) {
        this.banner.nativeElement.focus();
      }
    });
  }

  getNavItemDataToggle() {
    return (this.navbarContent && this.navbarContent.nativeElement.classList.contains('show')) ? 'collapse' : '';

  }

}
