import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { defineLocale, frLocale } from 'ngx-bootstrap';
import { LoginComponent } from './login.component';

defineLocale('fr', frLocale);

const routes: Routes = [
  { path: 'login', component: LoginComponent }
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class LoginModule { }
