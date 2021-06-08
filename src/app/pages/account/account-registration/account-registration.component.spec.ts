import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountRegistrationComponent } from './account-registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxLoadingModule } from 'ngx-loading';
import { ComponentsModule } from '../../../components/components.module';
import { AnalyticsService } from '../../../services/analytics.service';
import { MockAnalyticsService } from '../../../../../test/mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

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
        ComponentsModule,
        NoopAnimationsModule,
        BsDatepickerModule.forRoot(),
      ],
      providers: [
        {provide: AnalyticsService, useClass: MockAnalyticsService}
      ]
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
