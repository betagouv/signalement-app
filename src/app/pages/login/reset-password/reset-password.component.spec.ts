import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { NgxLoadingModule } from 'ngx-loading';
import { AbTestsService } from 'angular-ab-tests';
import { MockAbTestsService } from '../../../../test';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        NgxLoadingModule,
        Angulartics2RouterlessModule.forRoot()
      ],
      providers: [
        { provide: AbTestsService, useClass: MockAbTestsService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
