import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetractationComponent } from './retractation.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';

describe('RetractationComponent', () => {
  let component: RetractationComponent;
  let fixture: ComponentFixture<RetractationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetractationComponent ],
      imports: [
        FormsModule,
        BsDatepickerModule.forRoot(),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetractationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
