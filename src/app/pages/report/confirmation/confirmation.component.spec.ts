import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationComponent } from './confirmation.component';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportStorageService } from '../../../services/report-storage.service';
import { DraftReport } from '../../../model/Report';
import { CompanySearchResult } from '../../../model/CompanySearchResult';
import { Consumer } from '../../../model/Consumer';
import { PipesModule } from '../../../pipes/pipes.module';

describe('ConfirmationComponent', () => {

  const draftReportFixture = Object.assign(
    new DraftReport(), {
      company: Object.assign(
        new CompanySearchResult(),
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
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        NgxLoadingModule,
        Angulartics2RouterlessModule.forRoot(),
        PipesModule
      ],
      providers: []
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    reportStorageService = TestBed.get(ReportStorageService);
    reportStorageService.changeReportInProgress(draftReportFixture);

    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
