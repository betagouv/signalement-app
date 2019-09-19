import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgmentComponent } from './acknowledgment.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AbTestsService } from 'angular-ab-tests';
import { MockAbTestsService } from '../../../../test';

describe('AcknoledgmentComponent', () => {
  let component: AcknowledgmentComponent;
  let fixture: ComponentFixture<AcknowledgmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcknowledgmentComponent ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
      ],
      providers: [
      { provide: AbTestsService, useClass: MockAbTestsService },
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcknowledgmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
