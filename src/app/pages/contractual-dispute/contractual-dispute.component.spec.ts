import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractualDisputeComponent } from './contractual-dispute.component';
import { ComponentsModule } from '../../components/components.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '../../services/analytics.service';
import { MockAnalyticsService } from '../../../../test/mocks';

describe('ContractualDisputeComponent', () => {
  let component: ContractualDisputeComponent;
  let fixture: ComponentFixture<ContractualDisputeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractualDisputeComponent ],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'not-found', redirectTo: '' }]),
        ComponentsModule,
      ],
      providers: [
        {provide: AnalyticsService, useClass: MockAnalyticsService}
      ]
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
