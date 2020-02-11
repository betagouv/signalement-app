import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetComponent } from './password-reset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { NgxLoadingModule } from 'ngx-loading';
import { ComponentsModule } from '../../../components/components.module';
import { PasswordStrengthModule } from '../../../components/password-strength/password-strength.module';

describe('ResetPasswordComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordResetComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        NgxLoadingModule,
        Angulartics2RouterlessModule.forRoot(),
        ComponentsModule,
        PasswordStrengthModule
      ],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
