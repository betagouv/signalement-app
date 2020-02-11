import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountRegistrationComponent } from './account-registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxLoadingModule } from 'ngx-loading';
import { ComponentsModule } from '../../../components/components.module';
import { PasswordStrengthModule } from '../../../components/password-strength/password-strength.module';

describe('AccountActivationComponent', () => {
  let component: AccountRegistrationComponent;
  let fixture: ComponentFixture<AccountRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountRegistrationComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: 'connexion', redirectTo: '' }]),
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
    fixture = TestBed.createComponent(AccountRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
