import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProComponent } from './pro.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProComponent', () => {
  let component: ProComponent;
  let fixture: ComponentFixture<ProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProComponent ],
      imports: [
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
