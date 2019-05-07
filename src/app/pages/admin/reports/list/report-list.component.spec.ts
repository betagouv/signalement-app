import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsDatepickerModule, BsDropdownModule, ModalModule, PaginationModule, TooltipModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ReportListComponent } from './report-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('ReportsComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportListComponent
      ],
      imports: [
        PaginationModule.forRoot(),
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        FormsModule
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
