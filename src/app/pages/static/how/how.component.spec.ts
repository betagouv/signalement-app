import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowComponent } from './how.component';
import { ComponentsModule } from '../../../components/components.module';

describe('HowComponent', () => {
  let component: HowComponent;
  let fixture: ComponentFixture<HowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowComponent ],
      imports: [
        ComponentsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
