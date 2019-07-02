import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationComponent } from './confirmation.component';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrecedeByPipe } from '../../../pipes/precede-by.pipe';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportStorageService } from '../../../services/report-storage.service';
import { Report } from '../../../model/Report';
import { Company } from '../../../model/Company';
import { Consumer } from '../../../model/Consumer';

describe('ConfirmationComponent', () => {

  const reportFixture = Object.assign(
    new Report(), {
      company: Object.assign(
        new Company(),
        {
          name: 'Mon entreprise',
          line1: 'Mon entreprise',
          line2: 'Mon adresse dans ma ville',
          postalCode: '87270',
          siret: '12345678901234'
        }
      ),
      consumer: Object.assign(
        new Consumer()
      )
    }
  );

  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;
  let reportStorageService: ReportStorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConfirmationComponent,
        BreadcrumbComponent,
        PrecedeByPipe,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        NgxLoadingModule,
        Angulartics2RouterlessModule.forRoot(),
      ],
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    reportStorageService = TestBed.get(ReportStorageService);
    reportStorageService.changeReportInProgress(reportFixture);

    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
