import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportListProComponent } from './report-list-pro.component';

describe('ListProComponent', () => {
  let component: ReportListProComponent;
  let fixture: ComponentFixture<ReportListProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportListProComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportListProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
