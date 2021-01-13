import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerReviewComponent } from './consumer-review.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentsModule } from '../../../components/components.module';

describe('ConsumerReviewComponent', () => {
  let component: ConsumerReviewComponent;
  let fixture: ComponentFixture<ConsumerReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerReviewComponent ],
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
    fixture = TestBed.createComponent(ConsumerReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
