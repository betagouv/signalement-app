import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DGCCRFComponent } from './dgccrf.component';
import { ComponentsModule } from '../../components/components.module';

describe('HowComponent', () => {
  let component: DGCCRFComponent;
  let fixture: ComponentFixture<DGCCRFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DGCCRFComponent ],
      imports: [
        ComponentsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DGCCRFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
