import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitemapComponent } from './sitemap.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentsModule } from '../../../components/components.module';

describe('SitemapComponent', () => {
  let component: SitemapComponent;
  let fixture: ComponentFixture<SitemapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitemapComponent ],
      imports: [
        RouterTestingModule,
        ComponentsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
