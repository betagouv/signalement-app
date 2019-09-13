import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BsDatepickerModule, BsDropdownModule, PaginationModule, TooltipModule } from 'ngx-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
import { MostReportedListComponent } from './most-reported-list.component';
import { AppRoleDirective } from '../../../../directives/app-role.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

describe('MostReportedListComponent', () => {
  let component: MostReportedListComponent;
  let fixture: ComponentFixture<MostReportedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MostReportedListComponent,
        AppRoleDirective,
       ],
       imports: [
        PaginationModule.forRoot(),
        TooltipModule.forRoot(),
        NgxLoadingModule,
        FormsModule,
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        RouterTestingModule,
        HttpClientModule,
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostReportedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
