import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerAdviceComponent } from './consumer-advice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentsModule } from '../../../components/components.module';

describe('ConsumerAdviceComponent', () => {
  let component: ConsumerAdviceComponent;
  let fixture: ComponentFixture<ConsumerAdviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerAdviceComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgxLoadingModule,
        HttpClientModule,
        RouterTestingModule,
        ComponentsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
