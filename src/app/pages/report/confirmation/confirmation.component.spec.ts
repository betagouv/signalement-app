import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationComponent } from './confirmation.component';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Report, ReportDetails } from '../../../model/Report';
import { Consumer } from '../../../model/Consumer';
import { Company } from '../../../model/Company';
import { PrecedeByPipe } from '../../../pipes/precede-by.pipe';
import { Subcategory } from '../../../model/Anomaly';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { ReportService } from '../../../services/report.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  const anomalyDateFixture = new Date(2018, 2, 1);
  const anomalyFileFixture = new File([], 'anomaly.jpg');
  const subcategory = new Subcategory();
  subcategory.title = 'sous catégorie';
  const reportDetailsFixture = new ReportDetails();
  reportDetailsFixture.description = 'desc';
  reportDetailsFixture.anomalyDate = anomalyDateFixture;
  reportDetailsFixture.anomalyTimeSlot = 5;
  reportDetailsFixture.anomalyFile = anomalyFileFixture;
  const consumerFixture = new Consumer();
  consumerFixture.lastName = 'lastName';
  consumerFixture.firstName = 'firstName';
  consumerFixture.email = 'email@mail.fr';
  const companyFixture = new Company();
  companyFixture.name = 'companyName'
  companyFixture.line1 = 'line 1'
  companyFixture.line2 = 'line 2'
  companyFixture.line4 = 'line 4'
  const reportFixture = new Report();
  reportFixture.category = 'categorie'
  reportFixture.subcategory = subcategory;
  reportFixture.details = reportDetailsFixture;
  reportFixture.consumer = consumerFixture;
  reportFixture.company = companyFixture;

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
      providers: [
        ReportService,
      ]
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    component.report = reportFixture;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
