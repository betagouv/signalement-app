import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsDatepickerModule, BsDropdownModule, ModalModule, PaginationModule, TooltipModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ReportListComponent } from './report-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportDetailComponent } from '../detail/report-detail.component';
import { NgxLoadingModule } from 'ngx-loading';

describe('ReportsComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportListComponent,
        ReportDetailComponent
      ],
      imports: [
        PaginationModule.forRoot(),
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        HttpClientModule,
        NgxLoadingModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
