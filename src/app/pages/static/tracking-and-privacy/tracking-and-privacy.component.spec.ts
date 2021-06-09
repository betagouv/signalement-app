import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingAndPrivacyComponent } from './tracking-and-privacy.component';
import { ComponentsModule } from '../../../components/components.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

describe('TrackingAndPrivacyComponent', () => {
  let component: TrackingAndPrivacyComponent;
  let fixture: ComponentFixture<TrackingAndPrivacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingAndPrivacyComponent ],
      imports: [
        ComponentsModule,
        NoopAnimationsModule,
        BsDatepickerModule.forRoot(),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingAndPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
