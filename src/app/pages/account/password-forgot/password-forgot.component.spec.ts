import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordForgotComponent } from './password-forgot.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxLoadingModule } from 'ngx-loading';
import { ComponentsModule } from '../../../components/components.module';
import { AnalyticsService } from '../../../services/analytics.service';
import { MockAnalyticsService } from '../../../../../test/mocks';

describe('ForgetPasswordComponent', () => {
  let component: PasswordForgotComponent;
  let fixture: ComponentFixture<PasswordForgotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordForgotComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        NgxLoadingModule,
        ComponentsModule
      ],
      providers: [
        {provide: AnalyticsService, useClass: MockAnalyticsService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
