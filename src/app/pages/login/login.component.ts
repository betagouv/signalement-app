import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;

  showErrors: boolean;
  authenticationError: string;

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle(pages.login.title);
    this.meta.updateTag({ name: 'description', content: pages.login.description });
    this.initLoginForm();
  }

  initLoginForm() {
    this.emailCtrl = this.formBuilder.control('', Validators.required);
    this.passwordCtrl = this.formBuilder.control('', Validators.required);

    this.loginForm = this.formBuilder.group({
      login: this.emailCtrl,
      password: this.passwordCtrl
    });
  }

  submitLoginForm() {
    this.authenticationError = '';
    if (!this.loginForm.valid) {
      this.showErrors = true;
    } else {
      this.authenticationService.login(this.emailCtrl.value, this.passwordCtrl.value).subscribe(
        user => {
          this.router.navigate(['suivi-des-signalements']);
        },
        error => {
          this.authenticationError = `Echec de l'authentification`;
        }
      );
    }
  }

}
