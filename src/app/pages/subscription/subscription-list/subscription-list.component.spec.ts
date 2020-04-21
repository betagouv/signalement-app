import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionListComponent } from './subscription-list.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';
import { ComponentsModule } from '../../../components/components.module';

describe('SubscriptionListComponent', () => {
  let component: SubscriptionListComponent;
  let fixture: ComponentFixture<SubscriptionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubscriptionListComponent,
      ],
      imports: [
        HttpClientModule,
        NgxLoadingModule,
        ComponentsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
