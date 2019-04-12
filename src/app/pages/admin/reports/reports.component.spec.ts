import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsComponent } from './reports.component';
import { BsDropdownModule, PaginationModule, TooltipModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportsComponent
      ],
      imports: [
        PaginationModule.forRoot(),
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        HttpClientModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
