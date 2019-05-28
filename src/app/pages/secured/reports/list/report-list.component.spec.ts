import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsDatepickerModule, BsDropdownModule, ModalModule, PaginationModule, TooltipModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ReportListComponent } from './report-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportDetailComponent } from '../detail/report-detail.component';
import { NgxLoadingModule } from 'ngx-loading';
import { AppRoleDirective } from '../../../../directives/app-role.directive';
import { AppPermissionDirective } from '../../../../directives/app-permission.directive';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReportsComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportListComponent,
        ReportDetailComponent,
        AppRoleDirective,
        AppPermissionDirective
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
        ReactiveFormsModule,
        RouterTestingModule,
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
