import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractualDisputeComponent } from './contractual-dispute.component';

describe('ContractualDisputeComponent', () => {
  let component: ContractualDisputeComponent;
  let fixture: ComponentFixture<ContractualDisputeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractualDisputeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractualDisputeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
