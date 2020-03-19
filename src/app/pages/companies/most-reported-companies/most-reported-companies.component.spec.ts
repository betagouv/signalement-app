import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BsDatepickerModule, BsDropdownModule, PaginationModule, TooltipModule } from 'ngx-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
import { MostReportedCompaniesComponent } from './most-reported-companies.component';
import { AppRoleDirective } from '../../../directives/app-role/app-role.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from '../../../components/components.module';

describe('MostReportedListComponent', () => {
  let component: MostReportedCompaniesComponent;
  let fixture: ComponentFixture<MostReportedCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MostReportedCompaniesComponent,
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
         ComponentsModule
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostReportedCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
