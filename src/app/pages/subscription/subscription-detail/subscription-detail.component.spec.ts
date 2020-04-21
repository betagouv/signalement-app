import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionDetailComponent } from './subscription-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';
import { ComponentsModule } from '../../../components/components.module';

describe('SubscriptionDetailComponent', () => {
  let component: SubscriptionDetailComponent;
  let fixture: ComponentFixture<SubscriptionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubscriptionDetailComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxLoadingModule,
        ComponentsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
