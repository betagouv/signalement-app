import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsComponent } from './attachments.component';
import { NgxLoadingModule } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';

describe('AttachmentsComponent', () => {
  let component: AttachmentsComponent;
  let fixture: ComponentFixture<AttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentsComponent ],
      imports: [
        NgxLoadingModule,
        HttpClientModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
