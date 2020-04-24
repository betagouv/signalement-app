import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingAndPrivacyComponent } from './tracking-and-privacy.component';
import { ComponentsModule } from '../../../components/components.module';

describe('TrackingAndPrivacyComponent', () => {
  let component: TrackingAndPrivacyComponent;
  let fixture: ComponentFixture<TrackingAndPrivacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingAndPrivacyComponent ],
      imports: [
        ComponentsModule
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
