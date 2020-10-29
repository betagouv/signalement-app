import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxLoadingModule } from 'ngx-loading';
import { CompaniesAdminComponent } from './companies-admin.component';
import { AppRoleDirective } from '../../../directives/app-role/app-role.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from '../../../components/components.module';
import { CompanyCardComponent } from '../company-card/company-card.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { of } from 'rxjs';
import { User } from '../../../model/AuthUser';
import { AppPermissionDirective } from '../../../directives/app-permission/app-permission.directive';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { AuthUserStorageKey } from '../../../services/service.utils';

describe('CompaniesAdminComponent', () => {

  let component: CompaniesAdminComponent;
  let fixture: ComponentFixture<CompaniesAdminComponent>;
  let authenticationService: AuthenticationService;
  let localStorage: LocalStorage;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompaniesAdminComponent,
        AppRoleDirective,
        CompanyCardComponent,
        AppPermissionDirective,
      ],
      imports: [
        PaginationModule.forRoot(),
        TooltipModule.forRoot(),
        NgxLoadingModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        RouterTestingModule,
        HttpClientModule,
        ComponentsModule,
        ModalModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    authenticationService = TestBed.inject(AuthenticationService);
    localStorage = TestBed.inject(LocalStorage);
    localStorage.setItemSubscribe(AuthUserStorageKey, (Object.assign(new User(), { role: 'Admin' })));
    fixture = TestBed.createComponent(CompaniesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
