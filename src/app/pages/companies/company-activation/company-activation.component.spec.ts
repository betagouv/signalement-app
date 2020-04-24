import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyActivationComponent } from './company-activation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { NgxLoadingModule } from 'ngx-loading';
import { BannerComponent } from '../../../components/banner/banner.component';

describe('CompanyActivationComponent', () => {
  let component: CompanyActivationComponent;
  let fixture: ComponentFixture<CompanyActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompanyActivationComponent,
        BannerComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        Angulartics2RouterlessModule.forRoot(),
        NgxLoadingModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
