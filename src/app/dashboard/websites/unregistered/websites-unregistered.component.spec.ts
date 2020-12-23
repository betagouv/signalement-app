import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsitesUnregisteredComponent } from './websites-unregistered.component';
import { ComponentsModule } from '../../../components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { WebsiteService } from '../../../services/website.service';

describe('UnregisteredComponent', () => {

  let component: WebsitesUnregisteredComponent;
  let fixture: ComponentFixture<WebsitesUnregisteredComponent>;
  let websiteService: WebsiteService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsitesUnregisteredComponent ],
      imports: [
        ComponentsModule,
        SharedModule,
        RouterTestingModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    websiteService = TestBed.inject(WebsiteService);
    fixture = TestBed.createComponent(WebsitesUnregisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list unregistered websites in a datatable', () => {

    spyOn(websiteService, 'listUnregistered').and.returnValue(of([{ host: 'host1.fr', count: 1}, { host: 'host2.fr', count: 2}]));

    component.ngOnInit();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('tbody')).not.toBeNull();
    expect(nativeElement.querySelectorAll('tbody > tr').length).toBe(2);

  });
});
