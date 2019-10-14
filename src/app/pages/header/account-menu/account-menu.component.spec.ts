import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMenuComponent } from './account-menu.component';
import { AppRoleDirective } from '../../../directives/app-role.directive';
import { AppPermissionDirective } from '../../../directives/app-permission.directive';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('AccountMenuComponent', () => {
  let component: AccountMenuComponent;
  let fixture: ComponentFixture<AccountMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountMenuComponent,
        AppRoleDirective,
        AppPermissionDirective,
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
