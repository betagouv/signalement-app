import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CguComponent } from './cgu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentsModule } from '../../../components/components.module';

describe('CguComponent', () => {
  let component: CguComponent;
  let fixture: ComponentFixture<CguComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CguComponent ],
      imports: [
        RouterTestingModule,
        ComponentsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CguComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
