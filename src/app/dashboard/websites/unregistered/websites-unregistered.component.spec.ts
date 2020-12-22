import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsitesUnregisteredComponent } from './websites-unregistered.component';

describe('UnregisteredComponent', () => {
  let component: WebsitesUnregisteredComponent;
  let fixture: ComponentFixture<WebsitesUnregisteredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsitesUnregisteredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsitesUnregisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
