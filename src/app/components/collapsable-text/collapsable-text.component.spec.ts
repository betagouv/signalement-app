import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsableTextComponent } from './collapsable-text.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';

describe('CollapsableTextComponent', () => {
  let component: CollapsableTextComponent;
  let fixture: ComponentFixture<CollapsableTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CollapsableTextComponent,
        TruncatePipe,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsableTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
